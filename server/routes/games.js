const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
    getGameStats,
    getAllGameStats,
    updateGameStats,
    saveGameResult,
    getGameHistory,
    getLeaderboard,
    getDailyWordleResult,
    getFamilyWordleResults,
    getDailyWordSaladResult,
    getFamilyWordSaladResults,
    upsertWordSaladResult,
    getDailyPhotoMysteryResult,
    getFamilyPhotoMysteryResults
} = require('../db');

// Load photo puzzles and wordle words
const photoPuzzles = require('../data/photo-puzzles.json');
const wordleWords = require('../data/wordle-words.json');

// Hash function for daily puzzle selection
function hashDate(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Get daily photo puzzle based on date
function getDailyPhotoPuzzle(dateStr) {
    const index = hashDate(dateStr) % photoPuzzles.length;
    return photoPuzzles[index];
}

// Get daily wordle word based on date (uses UTC for consistency)
function getDailyWordleWord(dateStr) {
    const index = hashDate(dateStr) % wordleWords.length;
    return wordleWords[index].toUpperCase();
}

// Get current UTC date string
function getUTCDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

const router = express.Router();

// Get all stats for current user
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const stats = await getAllGameStats(req.session.userId);
        res.json({ stats });
    } catch (err) {
        console.error('Get all stats error:', err);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Get stats for a specific game
router.get('/stats/:game', requireAuth, async (req, res) => {
    try {
        const { game } = req.params;
        const stats = await getGameStats(req.session.userId, game);
        res.json({ stats: stats || { games_played: 0, games_won: 0, current_streak: 0, best_streak: 0 } });
    } catch (err) {
        console.error('Get game stats error:', err);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Save game result
router.post('/stats/:game', requireAuth, async (req, res) => {
    try {
        const { game } = req.params;
        const { score, won, details } = req.body;

        // Save result to history
        await saveGameResult(req.session.userId, game, score, won, details || {});

        // Update stats
        const stats = await updateGameStats(req.session.userId, game, won, score);

        res.json({ success: true, stats });
    } catch (err) {
        console.error('Save game result error:', err);
        res.status(500).json({ error: 'Failed to save game result' });
    }
});

// Get game history
router.get('/history/:game', requireAuth, async (req, res) => {
    try {
        const { game } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const history = await getGameHistory(req.session.userId, game, limit);
        res.json({ history });
    } catch (err) {
        console.error('Get game history error:', err);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

// Get leaderboard for a game
router.get('/leaderboard/:game', async (req, res) => {
    try {
        const { game } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const leaderboard = await getLeaderboard(game, limit);
        res.json({ leaderboard });
    } catch (err) {
        console.error('Get leaderboard error:', err);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
});

// Get today's wordle word (server-side determination using UTC)
router.get('/wordle/word', requireAuth, (req, res) => {
    const date = getUTCDateString();
    const word = getDailyWordleWord(date);
    res.json({ date, word });
});

// Get user's daily wordle status
router.get('/wordle/daily', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const result = await getDailyWordleResult(req.session.userId, date);
        if (result) {
            res.json({
                completed: true,
                won: result.won,
                guesses: result.details?.guesses || [],
                score: result.score
            });
        } else {
            res.json({ completed: false });
        }
    } catch (err) {
        console.error('Get daily wordle error:', err);
        res.status(500).json({ error: 'Failed to get daily wordle status' });
    }
});

// Get family wordle arena results
router.get('/wordle/arena', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Check if user has completed this day's puzzle
        const userResult = await getDailyWordleResult(req.session.userId, date);
        if (!userResult) {
            return res.status(403).json({ error: 'Complete today\'s puzzle first to see family results' });
        }

        // Get all family results for this date
        const results = await getFamilyWordleResults(date);

        res.json({
            results: results.map(r => ({
                username: r.username,
                won: r.won,
                guesses: r.details?.guesses || [],
                score: r.score,
                playedAt: r.played_at
            })),
            targetWord: userResult.details?.targetWord
        });
    } catch (err) {
        console.error('Get arena results error:', err);
        res.status(500).json({ error: 'Failed to get arena results' });
    }
});

// Get user's daily word salad status
router.get('/word-salad/daily', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const result = await getDailyWordSaladResult(req.session.userId, date);
        if (result) {
            res.json({
                result: {
                    score: result.score,
                    details: result.details
                }
            });
        } else {
            res.json({ result: null });
        }
    } catch (err) {
        console.error('Get daily word salad error:', err);
        res.status(500).json({ error: 'Failed to get daily word salad status' });
    }
});

// Save word salad result
router.post('/word-salad/result', requireAuth, async (req, res) => {
    try {
        const { score, words, date } = req.body;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const result = await upsertWordSaladResult(req.session.userId, date, score, words);
        res.json({ success: true, result });
    } catch (err) {
        console.error('Save word salad result error:', err);
        res.status(500).json({ error: 'Failed to save word salad result' });
    }
});

// Get family word salad arena results
router.get('/word-salad/arena', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Check if user has played this day's puzzle
        const userResult = await getDailyWordSaladResult(req.session.userId, date);
        if (!userResult) {
            return res.status(403).json({ error: 'Play today\'s puzzle first to see family results' });
        }

        // Get all family results for this date
        const results = await getFamilyWordSaladResults(date);

        res.json({
            results: results.map(r => ({
                username: r.username,
                score: r.score,
                words: r.details?.words || [],
                playedAt: r.played_at
            }))
        });
    } catch (err) {
        console.error('Get word salad arena results error:', err);
        res.status(500).json({ error: 'Failed to get arena results' });
    }
});

// Get daily photo mystery puzzle
router.get('/photo-mystery/daily', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const puzzle = getDailyPhotoPuzzle(date);

        // Check if user has already completed this puzzle
        const userResult = await getDailyPhotoMysteryResult(req.session.userId, date);

        if (userResult) {
            res.json({
                puzzle: {
                    id: puzzle.id,
                    imageUrl: puzzle.imageUrl,
                    answer: puzzle.answer,
                    acceptedAnswers: puzzle.acceptedAnswers,
                    category: puzzle.category
                },
                completed: true,
                won: userResult.won,
                guesses: userResult.details?.guesses || [],
                score: userResult.score
            });
        } else {
            // Don't send the answer or acceptedAnswers to client for active game
            res.json({
                puzzle: {
                    id: puzzle.id,
                    imageUrl: puzzle.imageUrl,
                    answer: puzzle.answer,
                    acceptedAnswers: puzzle.acceptedAnswers,
                    category: puzzle.category
                },
                completed: false
            });
        }
    } catch (err) {
        console.error('Get daily photo mystery error:', err);
        res.status(500).json({ error: 'Failed to get daily puzzle' });
    }
});

// Get family photo mystery arena results
router.get('/photo-mystery/arena', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Check if user has completed this day's puzzle
        const userResult = await getDailyPhotoMysteryResult(req.session.userId, date);
        if (!userResult) {
            return res.status(403).json({ error: 'Complete today\'s puzzle first to see family results' });
        }

        // Get all family results for this date
        const results = await getFamilyPhotoMysteryResults(date);
        const puzzle = getDailyPhotoPuzzle(date);

        res.json({
            results: results.map(r => ({
                username: r.username,
                won: r.won,
                guesses: r.details?.guesses || [],
                score: r.score,
                playedAt: r.played_at
            })),
            puzzle: {
                id: puzzle.id,
                answer: puzzle.answer,
                category: puzzle.category,
                imageUrl: puzzle.imageUrl
            }
        });
    } catch (err) {
        console.error('Get photo mystery arena results error:', err);
        res.status(500).json({ error: 'Failed to get arena results' });
    }
});

module.exports = router;
