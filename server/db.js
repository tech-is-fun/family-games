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
    getLeaderboard
};
