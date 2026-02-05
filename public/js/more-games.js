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

    // Also load today's Word Finder status separately
    loadTodayWordFinderStatus();
}

// Load today's Word Finder status
async function loadTodayWordFinderStatus() {
    try {
        // Get server date first
        const dateRes = await fetch('/api/games/wordle/word', { cache: 'no-store' });
        if (!dateRes.ok) return;
        const dateData = await dateRes.json();
        const todayDate = dateData.date;

        // Get today's Word Finder result
        const res = await fetch(`/api/games/word-salad/daily?date=${todayDate}`);
        if (res.ok) {
            const data = await res.json();
            const wordSaladEl = document.getElementById('word-salad-stats');

            if (data.result && data.result.details) {
                const details = typeof data.result.details === 'string'
                    ? JSON.parse(data.result.details)
                    : data.result.details;

                const score = details.score || 0;
                const wordCount = (details.words || []).length;
                const isDone = details.done || false;

                if (isDone) {
                    wordSaladEl.innerHTML = `
                        <span>Today: ${score} pts</span>
                        <span>${wordCount} words</span>
                        <span style="color: var(--success);">Done!</span>
                    `;
                } else {
                    wordSaladEl.innerHTML = `
                        <span>Today: ${score} pts</span>
                        <span>${wordCount} words</span>
                        <span style="color: var(--primary);">In progress</span>
                    `;
                }
            }
        }
    } catch (err) {
        console.error('Failed to load Word Finder status:', err);
    }
}

// Display stats on game cards
function displayStats(stats) {
    const wordSaladStats = stats.find(s => s.game_name === 'word-salad');
    const sudokuStats = stats.find(s => s.game_name === 'sudoku');
    const photoMysteryStats = stats.find(s => s.game_name === 'photo-mystery');

    const wordSaladEl = document.getElementById('word-salad-stats');
    const sudokuEl = document.getElementById('sudoku-stats');
    const photoMysteryEl = document.getElementById('photo-mystery-stats');

    if (wordSaladStats) {
        wordSaladEl.innerHTML = `
            <span>Played: ${wordSaladStats.games_played}</span>
            <span>Best: ${wordSaladStats.best_score || 0} pts</span>
        `;
    } else {
        wordSaladEl.innerHTML = '<span>No games yet</span>';
    }

    if (sudokuStats) {
        sudokuEl.innerHTML = `
            <span>Played: ${sudokuStats.games_played}</span>
            <span>Won: ${sudokuStats.games_won}</span>
        `;
    } else {
        sudokuEl.innerHTML = '<span>No games yet</span>';
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
    }
}

init();
