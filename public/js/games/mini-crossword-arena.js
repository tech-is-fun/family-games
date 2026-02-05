// Arena state
let currentDate = '';
let serverTodayDate = '';
const maxDaysBack = 3;

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

// Fetch server's date (Vancouver timezone)
async function fetchServerDate() {
    try {
        const res = await fetch('/api/games/wordle/word', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            serverTodayDate = data.date;
            return data.date;
        }
    } catch (err) {
        console.error('Failed to fetch server date:', err);
    }
    return new Date().toISOString().split('T')[0];
}

function getTodayDate() {
    return serverTodayDate || new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    if (dateStr === getTodayDate()) return 'Today';

    const today = new Date(getTodayDate() + 'T00:00:00');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return secs + 's';
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function getDateOffset(baseDate, days) {
    const date = new Date(baseDate + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Load arena results for a date
async function loadArenaResults(date) {
    const resultsEl = document.getElementById('family-results');
    resultsEl.innerHTML = '<div class="no-results">Loading...</div>';

    try {
        const res = await fetch(`/api/games/mini-crossword/arena?date=${date}`);

        if (res.status === 403) {
            resultsEl.innerHTML = `
                <div class="locked-message">
                    <h3>Locked</h3>
                    <p>Complete ${date === getTodayDate() ? "today's" : "this day's"} Mini Crossword first to see family results.</p>
                    <a href="/games/mini-crossword.html" class="btn btn-primary" style="margin-top: 1rem;">Play Mini Crossword</a>
                </div>
            `;
            return;
        }

        if (!res.ok) throw new Error('Failed to load results');

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            resultsEl.innerHTML = '<div class="no-results">No one has played yet on this day.</div>';
            return;
        }

        // Results are already sorted by score (time) ascending from server
        const ranks = ['🥇', '🥈', '🥉'];
        let html = '';

        data.results.forEach((result, i) => {
            const isBest = i === 0;
            const rank = ranks[i] || (i + 1);
            html += `
                <div class="player-result ${isBest ? 'best' : ''}">
                    <div class="player-info">
                        <span class="rank">${rank}</span>
                        <span class="player-name">${result.username}</span>
                    </div>
                    <span class="player-time">${formatTime(result.score)}</span>
                </div>
            `;
        });

        resultsEl.innerHTML = html;
    } catch (err) {
        console.error('Failed to load arena results:', err);
        resultsEl.innerHTML = '<div class="no-results">Failed to load results. Please try again.</div>';
    }
}

// Navigation
function updateNavigation() {
    const today = getTodayDate();
    const minDate = getDateOffset(today, -maxDaysBack);
    document.getElementById('current-date').textContent = formatDate(currentDate);
    document.getElementById('next-day').disabled = currentDate >= today;
    document.getElementById('prev-day').disabled = currentDate <= minDate;
}

document.getElementById('prev-day').addEventListener('click', () => {
    const minDate = getDateOffset(getTodayDate(), -maxDaysBack);
    if (currentDate > minDate) {
        currentDate = getDateOffset(currentDate, -1);
        updateNavigation();
        loadArenaResults(currentDate);
    }
});

document.getElementById('next-day').addEventListener('click', () => {
    if (currentDate < getTodayDate()) {
        currentDate = getDateOffset(currentDate, 1);
        updateNavigation();
        loadArenaResults(currentDate);
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
});

// Initialize
async function init() {
    const user = await checkAuth();
    if (user) {
        document.getElementById('username').textContent = user.username;
        await fetchServerDate();
        currentDate = getTodayDate();
        updateNavigation();
        loadArenaResults(currentDate);
    }
}

init();
