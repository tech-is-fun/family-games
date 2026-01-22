// Arena state
let currentDate = '';
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

// Get today's date string
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === getTodayDate()) {
        return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
}

// Get date offset by days
function getDateOffset(baseDate, days) {
    const date = new Date(baseDate + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Render player guesses
function renderGuesses(guesses, won) {
    let html = '<div class="player-guesses">';

    for (let i = 0; i < guesses.length; i++) {
        const isCorrect = won && i === guesses.length - 1;
        html += `<span class="guess-chip ${isCorrect ? 'correct' : ''}">${guesses[i]}</span>`;
    }

    html += '</div>';
    return html;
}

// Load arena results for a date
async function loadArenaResults(date) {
    const resultsEl = document.getElementById('family-results');
    const puzzleRevealEl = document.getElementById('puzzle-reveal');
    const puzzleImageEl = document.getElementById('puzzle-image');
    const puzzleAnswerEl = document.getElementById('puzzle-answer');
    const puzzleCategoryEl = document.getElementById('puzzle-category');

    resultsEl.innerHTML = '<div class="no-results">Loading...</div>';
    puzzleRevealEl.style.display = 'none';

    try {
        const res = await fetch(`/api/games/photo-mystery/arena?date=${date}`);

        if (res.status === 403) {
            resultsEl.innerHTML = `
                <div class="locked-message">
                    <h3>Locked</h3>
                    <p>Complete ${date === getTodayDate() ? "today's" : "this day's"} Photo Mystery puzzle first to see family results.</p>
                    <a href="/games/photo-mystery.html" class="btn btn-primary" style="margin-top: 1rem;">Play Photo Mystery</a>
                </div>
            `;
            return;
        }

        if (!res.ok) {
            throw new Error('Failed to load results');
        }

        const data = await res.json();

        if (data.results.length === 0) {
            resultsEl.innerHTML = '<div class="no-results">No one has played yet on this day.</div>';
            return;
        }

        // Show puzzle reveal
        if (data.puzzle) {
            puzzleImageEl.src = data.puzzle.imageUrl;
            puzzleAnswerEl.textContent = data.puzzle.answer;
            puzzleCategoryEl.textContent = data.puzzle.category;
            puzzleRevealEl.style.display = 'block';
        }

        // Render results - sorted by won first, then by fewer guesses
        const sortedResults = [...data.results].sort((a, b) => {
            if (a.won !== b.won) return b.won - a.won; // won first
            if (a.won && b.won) return a.score - b.score; // fewer guesses better
            return 0;
        });

        let html = '';
        for (const result of sortedResults) {
            html += `
                <div class="player-result">
                    <div class="player-header">
                        <span class="player-name">${result.username}</span>
                        <span class="player-status ${result.won ? 'won' : 'lost'}">
                            ${result.won ? `Guessed in ${result.guesses.length}` : 'Failed'}
                        </span>
                    </div>
                    ${renderGuesses(result.guesses, result.won)}
                </div>
            `;
        }

        resultsEl.innerHTML = html;
    } catch (err) {
        console.error('Failed to load arena results:', err);
        resultsEl.innerHTML = '<div class="no-results">Failed to load results. Please try again.</div>';
    }
}

// Update navigation buttons
function updateNavigation() {
    const today = getTodayDate();
    const minDate = getDateOffset(today, -maxDaysBack);

    document.getElementById('current-date').textContent = formatDate(currentDate);
    document.getElementById('next-day').disabled = currentDate >= today;
    document.getElementById('prev-day').disabled = currentDate <= minDate;
}

// Navigate to previous day
function goToPrevDay() {
    const minDate = getDateOffset(getTodayDate(), -maxDaysBack);
    if (currentDate > minDate) {
        currentDate = getDateOffset(currentDate, -1);
        updateNavigation();
        loadArenaResults(currentDate);
    }
}

// Navigate to next day
function goToNextDay() {
    const today = getTodayDate();
    if (currentDate < today) {
        currentDate = getDateOffset(currentDate, 1);
        updateNavigation();
        loadArenaResults(currentDate);
    }
}

// Event listeners
document.getElementById('prev-day').addEventListener('click', goToPrevDay);
document.getElementById('next-day').addEventListener('click', goToNextDay);

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
});

// Initialize
async function init() {
    const user = await checkAuth();
    if (user) {
        document.getElementById('username').textContent = user.username;
        currentDate = getTodayDate();
        updateNavigation();
        loadArenaResults(currentDate);
    }
}

init();
