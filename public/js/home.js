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
    const miniCrosswordStats = stats.find(s => s.game_name === 'mini-crossword');

    const wordleEl = document.getElementById('wordle-stats');
    const miniCrosswordEl = document.getElementById('mini-crossword-stats');

    if (wordleStats) {
        wordleEl.innerHTML = `
            <span>Played: ${wordleStats.games_played}</span>
            <span>Won: ${wordleStats.games_won}</span>
            <span>Streak: ${wordleStats.current_streak}</span>
        `;
    } else {
        wordleEl.innerHTML = '<span>No games yet</span>';
    }

    if (miniCrosswordEl) {
        if (miniCrosswordStats) {
            const bestTime = miniCrosswordStats.best_score;
            const bestDisplay = bestTime ? formatTimeShort(bestTime) : '-';
            miniCrosswordEl.innerHTML = `
                <span>Played: ${miniCrosswordStats.games_played}</span>
                <span>Best: ${bestDisplay}</span>
                <span>Streak: ${miniCrosswordStats.current_streak}</span>
            `;
        } else {
            miniCrosswordEl.innerHTML = '<span>No games yet</span>';
        }
    }
}

function formatTimeShort(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return secs + 's';
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Load today's Wordle leaderboard
async function loadWordleLeaderboard() {
    try {
        const res = await fetch('/api/games/wordle/today-scores');
        const data = await res.json();
        displayWordleLeaderboard(data.results);
    } catch (err) {
        console.error('Failed to load Wordle leaderboard:', err);
    }
}

// Display today's Wordle leaderboard
function displayWordleLeaderboard(results) {
    const tbody = document.getElementById('wordle-leaderboard-body');

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

// Load today's Mini Crossword leaderboard
async function loadMiniCrosswordLeaderboard() {
    try {
        const res = await fetch('/api/games/mini-crossword/today-scores');
        const data = await res.json();
        displayMiniCrosswordLeaderboard(data.results);
    } catch (err) {
        console.error('Failed to load Mini Crossword leaderboard:', err);
    }
}

// Display today's Mini Crossword leaderboard
function displayMiniCrosswordLeaderboard(results) {
    const tbody = document.getElementById('mini-crossword-leaderboard-body');

    if (!results || results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No one has played today yet</td></tr>';
        return;
    }

    // Find the fastest time (lowest score)
    const fastestTime = Math.min(...results.map(r => r.score));

    // Already sorted by score ascending from server
    tbody.innerHTML = results.map(player => {
        const isFastest = player.score === fastestTime;
        return `
            <tr class="${isFastest ? 'highlight-best' : ''}">
                <td>${player.username}</td>
                <td>${formatTimeShort(player.score)}</td>
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
        loadWordleLeaderboard();
        loadMiniCrosswordLeaderboard();
    }
}

init();
