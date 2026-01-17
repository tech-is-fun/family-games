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
    getFamilyWordleResults
} = require('../db');

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

module.exports = router;
