const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
    const client = await pool.connect();
    try {
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create game stats table
        await client.query(`
            CREATE TABLE IF NOT EXISTS game_stats (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                game_name VARCHAR(50) NOT NULL,
                games_played INTEGER DEFAULT 0,
                games_won INTEGER DEFAULT 0,
                best_score INTEGER,
                current_streak INTEGER DEFAULT 0,
                best_streak INTEGER DEFAULT 0,
                last_played TIMESTAMP,
                UNIQUE(user_id, game_name)
            )
        `);

        // Create game results table
        await client.query(`
            CREATE TABLE IF NOT EXISTS game_results (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                game_name VARCHAR(50) NOT NULL,
                score INTEGER,
                won BOOLEAN,
                details JSONB,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create password reset tokens table
        await client.query(`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create wordle starter words table
        await client.query(`
            CREATE TABLE IF NOT EXISTS wordle_starter_words (
                id SERIAL PRIMARY KEY,
                date DATE UNIQUE NOT NULL,
                word VARCHAR(5) NOT NULL,
                chosen_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables initialized');
    } finally {
        client.release();
    }
}

// User queries
async function createUser(username, passwordHash) {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
        [username, passwordHash]
    );
    return result.rows[0];
}

async function getUserByUsername(username) {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0];
}

async function getUserById(id) {
    const result = await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

// Game stats queries
async function getGameStats(userId, gameName) {
    const result = await pool.query(
        'SELECT * FROM game_stats WHERE user_id = $1 AND game_name = $2',
        [userId, gameName]
    );
    return result.rows[0];
}

async function getAllGameStats(userId) {
    const result = await pool.query(
        'SELECT * FROM game_stats WHERE user_id = $1',
        [userId]
    );
    return result.rows;
}

async function updateGameStats(userId, gameName, won, score) {
    // First, try to get existing stats
    let stats = await getGameStats(userId, gameName);

    if (!stats) {
        // Create new stats record
        await pool.query(
            `INSERT INTO game_stats (user_id, game_name, games_played, games_won, best_score, current_streak, best_streak, last_played)
             VALUES ($1, $2, 1, $3, $4, $5, $5, CURRENT_TIMESTAMP)`,
            [userId, gameName, won ? 1 : 0, score, won ? 1 : 0]
        );
    } else {
        // Update existing stats
        const newStreak = won ? stats.current_streak + 1 : 0;
        const bestStreak = Math.max(stats.best_streak, newStreak);
        const bestScore = score !== null && (stats.best_score === null || score < stats.best_score)
            ? score
            : stats.best_score;

        await pool.query(
            `UPDATE game_stats
             SET games_played = games_played + 1,
                 games_won = games_won + $3,
                 best_score = $4,
                 current_streak = $5,
                 best_streak = $6,
                 last_played = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND game_name = $2`,
            [userId, gameName, won ? 1 : 0, bestScore, newStreak, bestStreak]
        );
    }

    return getGameStats(userId, gameName);
}

// Game results queries
async function saveGameResult(userId, gameName, score, won, details) {
    const result = await pool.query(
        `INSERT INTO game_results (user_id, game_name, score, won, details)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, gameName, score, won, JSON.stringify(details)]
    );
    return result.rows[0];
}

async function getGameHistory(userId, gameName, limit = 10) {
    const result = await pool.query(
        `SELECT * FROM game_results
         WHERE user_id = $1 AND game_name = $2
         ORDER BY played_at DESC
         LIMIT $3`,
        [userId, gameName, limit]
    );
    return result.rows;
}

// Leaderboard queries
async function getLeaderboard(gameName, limit = 10) {
    const result = await pool.query(
        `SELECT u.username, gs.games_won, gs.games_played, gs.best_streak, gs.best_score
         FROM game_stats gs
         JOIN users u ON gs.user_id = u.id
         WHERE gs.game_name = $1
         ORDER BY gs.games_won DESC, gs.best_streak DESC
         LIMIT $2`,
        [gameName, limit]
    );
    return result.rows;
}

// Get user's wordle result for a specific date
async function getDailyWordleResult(userId, date) {
    const result = await pool.query(
        `SELECT * FROM game_results
         WHERE user_id = $1
         AND game_name = 'wordle'
         AND details->>'date' = $2
         ORDER BY played_at DESC
         LIMIT 1`,
        [userId, date]
    );
    return result.rows[0];
}

// Get all family wordle results for a specific date
async function getFamilyWordleResults(date) {
    const result = await pool.query(
        `SELECT gr.*, u.username
         FROM game_results gr
         JOIN users u ON gr.user_id = u.id
         WHERE gr.game_name = 'wordle'
         AND gr.details->>'date' = $1
         ORDER BY gr.played_at ASC`,
        [date]
    );
    return result.rows;
}

// Get user's word salad result for a specific date
async function getDailyWordSaladResult(userId, date) {
    const result = await pool.query(
        `SELECT * FROM game_results
         WHERE user_id = $1
         AND game_name = 'word-salad'
         AND details->>'date' = $2
         ORDER BY played_at DESC
         LIMIT 1`,
        [userId, date]
    );
    return result.rows[0];
}

// Get all family word salad results for a specific date
async function getFamilyWordSaladResults(date) {
    const result = await pool.query(
        `SELECT gr.*, u.username
         FROM game_results gr
         JOIN users u ON gr.user_id = u.id
         WHERE gr.game_name = 'word-salad'
         AND gr.details->>'date' = $1
         ORDER BY gr.score DESC`,
        [date]
    );
    return result.rows;
}

// Upsert word salad result (update if exists, insert if not)
async function upsertWordSaladResult(userId, date, score, words) {
    // Check if result exists
    const existing = await getDailyWordSaladResult(userId, date);

    if (existing) {
        // Update existing result
        const result = await pool.query(
            `UPDATE game_results
             SET score = $1, details = $2, played_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [score, JSON.stringify({ date, score, words }), existing.id]
        );
        return result.rows[0];
    } else {
        // Insert new result
        const result = await pool.query(
            `INSERT INTO game_results (user_id, game_name, score, won, details)
             VALUES ($1, 'word-salad', $2, true, $3)
             RETURNING *`,
            [userId, score, JSON.stringify({ date, score, words })]
        );
        return result.rows[0];
    }
}

// Get user's photo mystery result for a specific date
async function getDailyPhotoMysteryResult(userId, date) {
    const result = await pool.query(
        `SELECT * FROM game_results
         WHERE user_id = $1
         AND game_name = 'photo-mystery'
         AND details->>'date' = $2
         ORDER BY played_at DESC
         LIMIT 1`,
        [userId, date]
    );
    return result.rows[0];
}

// Get all family photo mystery results for a specific date
async function getFamilyPhotoMysteryResults(date) {
    const result = await pool.query(
        `SELECT gr.*, u.username
         FROM game_results gr
         JOIN users u ON gr.user_id = u.id
         WHERE gr.game_name = 'photo-mystery'
         AND gr.details->>'date' = $1
         ORDER BY gr.won DESC, gr.score ASC`,
        [date]
    );
    return result.rows;
}

// Wordle starter word functions
async function getStarterWord(date) {
    const result = await pool.query(
        `SELECT wsw.*, u.username as chosen_by_username
         FROM wordle_starter_words wsw
         LEFT JOIN users u ON wsw.chosen_by = u.id
         WHERE wsw.date = $1`,
        [date]
    );
    return result.rows[0];
}

async function setStarterWord(date, word, userId) {
    const result = await pool.query(
        `INSERT INTO wordle_starter_words (date, word, chosen_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (date) DO NOTHING
         RETURNING *`,
        [date, word.toLowerCase(), userId]
    );
    return result.rows[0];
}

async function getRecentStarterWords(days = 7) {
    const result = await pool.query(
        `SELECT word FROM wordle_starter_words
         WHERE date >= CURRENT_DATE - $1::integer
         ORDER BY date DESC`,
        [days]
    );
    return result.rows.map(r => r.word);
}

// Password reset functions
async function createPasswordResetToken(userId, token, expiresAt) {
    // Invalidate any existing tokens for this user
    await pool.query(
        'UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1 AND used = FALSE',
        [userId]
    );

    const result = await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, token, expiresAt]
    );
    return result.rows[0];
}

async function getPasswordResetToken(token) {
    const result = await pool.query(
        `SELECT prt.*, u.username
         FROM password_reset_tokens prt
         JOIN users u ON prt.user_id = u.id
         WHERE prt.token = $1 AND prt.used = FALSE AND prt.expires_at > NOW()`,
        [token]
    );
    return result.rows[0];
}

async function markTokenAsUsed(token) {
    await pool.query(
        'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
        [token]
    );
}

async function updateUserPassword(userId, passwordHash) {
    await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [passwordHash, userId]
    );
}

module.exports = {
    pool,
    initializeDatabase,
    createUser,
    getUserByUsername,
    getUserById,
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
    createPasswordResetToken,
    getPasswordResetToken,
    markTokenAsUsed,
    updateUserPassword
};
