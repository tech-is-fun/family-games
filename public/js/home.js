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
    const photoMysteryStats = stats.find(s => s.game_name === 'photo-mystery');

    const wordleEl = document.getElementById('wordle-stats');
    const sudokuEl = document.getElementById('sudoku-stats');
    const wordSaladEl = document.getElementById('word-salad-stats');
    const photoMysteryEl = document.getElementById('photo-mystery-stats');

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

    if (photoMysteryStats) {
        photoMysteryEl.innerHTML = `
            <span>Played: ${photoMysteryStats.games_played}</span>
            <span>Won: ${photoMysteryStats.games_won}</span>
            <span>Streak: ${photoMysteryStats.current_streak}</span>
        `;
    } else {
        photoMysteryEl.innerHTML = '<span>No games yet</span>';
    }
}

// Load today's Wordle leaderboard
async function loadLeaderboard() {
    try {
        const res = await fetch('/api/games/wordle/today-scores');
        const data = await res.json();
        displayLeaderboard(data.results);
    } catch (err) {
        console.error('Failed to load leaderboard:', err);
    }
}

// Display today's Wordle leaderboard
function displayLeaderboard(results) {
    const tbody = document.getElementById('leaderboard-body');

    if (!results || results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No one has played today yet</td></tr>';
        return;
    }

    // Find the lowest score (best performance) among winners
    const winners = results.filter(r => r.won);
    const lowestScore = winners.length > 0 ? Math.min(...winners.map(r => r.score)) : null;

    // Sort by score (lowest first for winners, then non-winners)
    const sorted = [...results].sort((a, b) => {
        // Winners come before non-winners
        if (a.won && !b.won) return -1;
        if (!a.won && b.won) return 1;
        // Among winners, lower score is better
        return a.score - b.score;
    });

    tbody.innerHTML = sorted.map(player => {
        const isLowest = player.won && player.score === lowestScore;
        const scoreDisplay = player.won ? player.score : 'X';
        return `
            <tr class="${isLowest ? 'highlight-best' : ''}">
                <td>${player.username}</td>
                <td>${scoreDisplay}</td>
            </tr>
        `;
    }).join('');
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
