// Check authentication
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
            window.location.href = '/';
            return null;
        }
        const data = await res.json();
        return data.user;
    } catch (err) {
        window.location.href = '/';
        return null;
    }
}

// Load user stats
async function loadStats() {
    try {
        const res = await fetch('/api/games/stats');
        if (res.ok) {
            const data = await res.json();
            displayStats(data.stats);
        }
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

// Display stats on game cards
function displayStats(stats) {
    const wordleStats = stats.find(s => s.game_name === 'wordle');
    const sudokuStats = stats.find(s => s.game_name === 'sudoku');
    const wordSaladStats = stats.find(s => s.game_name === 'word-salad');

    const wordleEl = document.getElementById('wordle-stats');
    const sudokuEl = document.getElementById('sudoku-stats');
    const wordSaladEl = document.getElementById('word-salad-stats');

    if (wordleStats) {
        wordleEl.innerHTML = `
            <span>Played: ${wordleStats.games_played}</span>
            <span>Won: ${wordleStats.games_won}</span>
            <span>Streak: ${wordleStats.current_streak}</span>
        `;
    } else {
        wordleEl.innerHTML = '<span>No games yet</span>';
    }

    if (sudokuStats) {
        sudokuEl.innerHTML = `
            <span>Played: ${sudokuStats.games_played}</span>
            <span>Won: ${sudokuStats.games_won}</span>
        `;
    } else {
        sudokuEl.innerHTML = '<span>No games yet</span>';
    }

    if (wordSaladStats) {
        wordSaladEl.innerHTML = `
            <span>Played: ${wordSaladStats.games_played}</span>
            <span>Best: ${wordSaladStats.best_score || 0} pts</span>
        `;
    } else {
        wordSaladEl.innerHTML = '<span>No games yet</span>';
    }
}

// Load combined leaderboard
async function loadLeaderboard() {
    try {
        const [wordleRes, sudokuRes, wordSaladRes] = await Promise.all([
            fetch('/api/games/leaderboard/wordle'),
            fetch('/api/games/leaderboard/sudoku'),
            fetch('/api/games/leaderboard/word-salad')
        ]);

        const wordleData = await wordleRes.json();
        const sudokuData = await sudokuRes.json();
        const wordSaladData = await wordSaladRes.json();

        displayLeaderboard(wordleData.leaderboard, sudokuData.leaderboard, wordSaladData.leaderboard);
    } catch (err) {
        console.error('Failed to load leaderboard:', err);
    }
}

// Display combined leaderboard
function displayLeaderboard(wordleBoard, sudokuBoard, wordSaladBoard) {
    const tbody = document.getElementById('leaderboard-body');

    // Combine data by username
    const players = new Map();

    wordleBoard.forEach(entry => {
        players.set(entry.username, {
            username: entry.username,
            wordleWins: entry.games_won,
            sudokuWins: 0,
            wordSaladBest: 0
        });
    });

    sudokuBoard.forEach(entry => {
        if (players.has(entry.username)) {
            players.get(entry.username).sudokuWins = entry.games_won;
        } else {
            players.set(entry.username, {
                username: entry.username,
                wordleWins: 0,
                sudokuWins: entry.games_won,
                wordSaladBest: 0
            });
        }
    });

    wordSaladBoard.forEach(entry => {
        if (players.has(entry.username)) {
            players.get(entry.username).wordSaladBest = entry.best_score || 0;
        } else {
            players.set(entry.username, {
                username: entry.username,
                wordleWins: 0,
                sudokuWins: 0,
                wordSaladBest: entry.best_score || 0
            });
        }
    });

    // Sort by total wins + word salad score
    const sorted = Array.from(players.values()).sort((a, b) => {
        const totalA = a.wordleWins + a.sudokuWins + a.wordSaladBest;
        const totalB = b.wordleWins + b.sudokuWins + b.wordSaladBest;
        return totalB - totalA;
    });

    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No games played yet</td></tr>';
        return;
    }

    tbody.innerHTML = sorted.map(player => `
        <tr>
            <td>${player.username}</td>
            <td>${player.wordleWins}</td>
            <td>${player.sudokuWins}</td>
            <td>${player.wordSaladBest}</td>
        </tr>
    `).join('');
}

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (err) {
        console.error('Logout failed:', err);
    }
});

// Initialize
async function init() {
    const user = await checkAuth();
    if (user) {
        document.getElementById('username').textContent = user.username;
        loadStats();
        loadLeaderboard();
    }
}

init();
