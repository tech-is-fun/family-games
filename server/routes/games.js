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
    getFamilyPhotoMysteryResults,
    getStarterWord,
    setStarterWord,
    getRecentStarterWords,
    getNytWordleWord,
    getDailyMiniCrosswordResult,
    getFamilyMiniCrosswordResults,
    getNytMiniCrossword
} = require('../db');

// Load photo puzzles, wordle words, and mini crossword puzzles
const photoPuzzles = require('../data/photo-puzzles.json');
const wordleWords = require('../data/wordle-words.json');
const miniCrosswordPuzzles = require('../data/mini-crossword-puzzles.json');

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

// Get current date string in Vancouver (Pacific) timezone
function getVancouverDateString() {
    const now = new Date();
    // Format: YYYY-MM-DD in Vancouver timezone
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
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

// Get wordle word for a specific date (or today if not specified)
// Only returns the NYT word - game is not available until word is fetched
router.get('/wordle/word', requireAuth, async (req, res) => {
    try {
        const today = getVancouverDateString();
        // Allow fetching previous days' words (up to 7 days back)
        let date = req.query.date || today;

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            date = today;
        }

        // Don't allow future dates
        if (date > today) {
            date = today;
        }

        // Check if date is too old (more than 7 days ago)
        const dateObj = new Date(date + 'T00:00:00');
        const todayObj = new Date(today + 'T00:00:00');
        const daysDiff = Math.floor((todayObj - dateObj) / (1000 * 60 * 60 * 24));
        if (daysDiff > 7) {
            return res.json({
                date,
                ready: false,
                message: "Puzzles older than 7 days are no longer available."
            });
        }

        // Try to get the NYT word
        const nytWord = await getNytWordleWord(date);
        if (nytWord && nytWord.word) {
            return res.json({
                date,
                word: nytWord.word.toUpperCase(),
                source: nytWord.source || 'nyt',
                ready: true,
                isToday: date === today
            });
        }

        // NYT word not available yet
        res.json({
            date,
            ready: false,
            message: date === today
                ? "Today's Wordle is not ready yet. The NYT word is fetched daily at 5am PST. Please check back later."
                : "This puzzle is not available."
        });
    } catch (err) {
        console.error('Get wordle word error:', err);
        const date = getVancouverDateString();
        res.json({
            date,
            ready: false,
            message: "Unable to load Wordle. Please try again later."
        });
    }
});

// Get starter word for today
router.get('/wordle/starter', requireAuth, async (req, res) => {
    try {
        const date = getVancouverDateString();
        const starter = await getStarterWord(date);

        if (starter) {
            // Use game_name if available, otherwise fallback to username
            const displayName = starter.chosen_by_game_name || starter.chosen_by_username;
            res.json({
                hasStarter: true,
                word: starter.word.toUpperCase(),
                chosenBy: displayName,
                date
            });
        } else {
            // No starter word yet - provide suggestions
            const recentWords = await getRecentStarterWords(7);
            const recentSet = new Set(recentWords.map(w => w.toLowerCase()));

            // Get 5 random suggestions from word list, excluding recent starters
            const suggestions = [];
            const shuffled = [...wordleWords].sort(() => Math.random() - 0.5);
            for (const word of shuffled) {
                if (!recentSet.has(word.toLowerCase()) && suggestions.length < 5) {
                    suggestions.push(word.toUpperCase());
                }
                if (suggestions.length >= 5) break;
            }

            res.json({
                hasStarter: false,
                suggestions,
                date
            });
        }
    } catch (err) {
        console.error('Get starter word error:', err);
        res.status(500).json({ error: 'Failed to get starter word' });
    }
});

// Set starter word for today
router.post('/wordle/starter', requireAuth, async (req, res) => {
    try {
        const { word } = req.body;
        const date = getVancouverDateString();

        if (!word || word.length !== 5 || !/^[a-zA-Z]+$/.test(word)) {
            return res.status(400).json({ error: 'Word must be exactly 5 letters' });
        }

        // Client validates against full word list - server just ensures it's alphabetic

        // Try to set the starter word (will fail if one already exists)
        const result = await setStarterWord(date, word, req.session.userId);

        if (result) {
            res.json({
                success: true,
                word: result.word.toUpperCase(),
                date
            });
        } else {
            // Someone else already set it
            const existing = await getStarterWord(date);
            const displayName = existing.chosen_by_game_name || existing.chosen_by_username;
            res.json({
                success: false,
                alreadySet: true,
                word: existing.word.toUpperCase(),
                chosenBy: displayName
            });
        }
    } catch (err) {
        console.error('Set starter word error:', err);
        res.status(500).json({ error: 'Failed to set starter word' });
    }
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

// Get today's family wordle scores for leaderboard (doesn't require completion)
router.get('/wordle/today-scores', requireAuth, async (req, res) => {
    try {
        const date = getVancouverDateString();
        const results = await getFamilyWordleResults(date);

        res.json({
            date,
            results: results.map(r => ({
                username: r.username,
                won: r.won,
                score: r.score,
                playedAt: r.played_at
            }))
        });
    } catch (err) {
        console.error('Get today scores error:', err);
        res.status(500).json({ error: 'Failed to get today scores' });
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

// Get today's family word salad scores for leaderboard (doesn't require completion)
router.get('/word-salad/today-scores', requireAuth, async (req, res) => {
    try {
        const date = getVancouverDateString();
        const results = await getFamilyWordSaladResults(date);

        res.json({
            date,
            results: results.map(r => ({
                username: r.username,
                score: r.score,
                wordCount: (r.details?.words || []).length,
                playedAt: r.played_at
            }))
        });
    } catch (err) {
        console.error('Get word salad today scores error:', err);
        res.status(500).json({ error: 'Failed to get today scores' });
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
        const { score, words, date, done } = req.body;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const result = await upsertWordSaladResult(req.session.userId, date, score, words, done);
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

        // Check if this is today's puzzle and if current user is done
        const today = getVancouverDateString();
        const isToday = date === today;
        const currentUserDone = userResult.details?.done || false;

        res.json({
            results: results.map(r => {
                const playerDone = r.details?.done || false;
                const words = r.details?.words || [];
                // Show words if: not today, OR current user is done, OR this player is done
                const showWords = !isToday || currentUserDone || playerDone;

                return {
                    username: r.username,
                    score: r.score,
                    wordCount: words.length,
                    words: showWords ? words : [],
                    done: playerDone,
                    playedAt: r.played_at
                };
            })
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

// Manual trigger to fetch NYT Wordle word (for testing/admin)
router.post('/wordle/fetch-nyt', requireAuth, async (req, res) => {
    try {
        const { manualFetch } = require('../nyt-wordle-fetcher');
        const date = req.body.date || getVancouverDateString();

        const result = await manualFetch(date);
        if (result) {
            res.json({
                success: true,
                date: result.date,
                word: result.word.toUpperCase(),
                source: result.source
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Could not fetch NYT Wordle word from any source'
            });
        }
    } catch (err) {
        console.error('Manual NYT fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch NYT word' });
    }
});

// Manual trigger to fetch NYT Mini Crossword (for testing/admin)
router.post('/mini-crossword/fetch-nyt', requireAuth, async (req, res) => {
    try {
        const { manualFetch } = require('../nyt-crossword-fetcher');
        const date = req.body.date || getVancouverDateString();

        const result = await manualFetch(date);
        if (result) {
            res.json({
                success: true,
                date: result.date,
                source: result.source
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Could not fetch NYT Mini Crossword from any source'
            });
        }
    } catch (err) {
        console.error('Manual NYT mini crossword fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch NYT mini crossword' });
    }
});

// Get daily mini crossword puzzle
router.get('/mini-crossword/daily', requireAuth, async (req, res) => {
    try {
        const date = getVancouverDateString();

        // Check if user has already completed today's puzzle
        const userResult = await getDailyMiniCrosswordResult(req.session.userId, date);

        // Try to get fetched NYT puzzle first, fall back to local puzzle bank
        let puzzle;
        const nytPuzzle = await getNytMiniCrossword(date);
        if (nytPuzzle) {
            puzzle = typeof nytPuzzle.puzzle === 'string' ? JSON.parse(nytPuzzle.puzzle) : nytPuzzle.puzzle;
        } else {
            // Fall back to local puzzle bank
            const index = hashDate(date) % miniCrosswordPuzzles.length;
            puzzle = miniCrosswordPuzzles[index];
        }

        const size = puzzle.grid.length;

        if (userResult) {
            res.json({
                puzzle: {
                    grid: puzzle.grid,
                    clues: puzzle.clues,
                    size
                },
                completed: true,
                score: userResult.score,
                time: userResult.details?.time,
                date
            });
        } else {
            // Don't send grid answers for active game - send blank grid structure
            const blankGrid = puzzle.grid.map(row =>
                row.map(cell => cell === '#' ? '#' : '')
            );
            res.json({
                puzzle: {
                    grid: blankGrid,
                    answerGrid: puzzle.grid,
                    clues: puzzle.clues,
                    size
                },
                completed: false,
                date
            });
        }
    } catch (err) {
        console.error('Get daily mini crossword error:', err);
        res.status(500).json({ error: 'Failed to get daily puzzle' });
    }
});

// Get today's family mini crossword scores for leaderboard
router.get('/mini-crossword/today-scores', requireAuth, async (req, res) => {
    try {
        const date = getVancouverDateString();
        const results = await getFamilyMiniCrosswordResults(date);

        res.json({
            date,
            results: results.map(r => ({
                username: r.username,
                score: r.score,
                time: r.details?.time,
                playedAt: r.played_at
            }))
        });
    } catch (err) {
        console.error('Get mini crossword today scores error:', err);
        res.status(500).json({ error: 'Failed to get today scores' });
    }
});

// Get family mini crossword arena results
router.get('/mini-crossword/arena', requireAuth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        // Check if user has completed this day's puzzle
        const userResult = await getDailyMiniCrosswordResult(req.session.userId, date);
        if (!userResult) {
            return res.status(403).json({ error: 'Complete today\'s puzzle first to see family results' });
        }

        // Get all family results for this date
        const results = await getFamilyMiniCrosswordResults(date);

        res.json({
            results: results.map(r => ({
                username: r.username,
                score: r.score,
                time: r.details?.time,
                playedAt: r.played_at
            }))
        });
    } catch (err) {
        console.error('Get mini crossword arena results error:', err);
        res.status(500).json({ error: 'Failed to get arena results' });
    }
});

module.exports = router;
