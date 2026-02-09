// Arena state
let currentDate = '';
let serverTodayDate = ''; // Server's date in Vancouver timezone
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

// Fetch server's date (Vancouver timezone) - must be called before using getTodayDate
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
    // Fallback to local date if server fails
    return new Date().toISOString().split('T')[0];
}

// Get today's date string (uses server date)
function getTodayDate() {
    return serverTodayDate || new Date().toISOString().split('T')[0];
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

// Check guess result for a letter
function checkGuess(guess, targetWord) {
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: correct letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            targetLetters[i] = null;
            guessLetters[i] = null;
        }
    }

    // Second pass: present letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === null) continue;
        const index = targetLetters.indexOf(guessLetters[i]);
        if (index !== -1) {
            result[i] = 'present';
            targetLetters[index] = null;
        }
    }

    return result;
}

// Render mini board
function renderMiniBoard(guesses, targetWord) {
    let html = '<div class="mini-board">';

    for (const guess of guesses) {
        const result = checkGuess(guess, targetWord);
        html += '<div class="mini-row">';
        for (let i = 0; i < 5; i++) {
            html += `<div class="mini-cell ${result[i]}">${guess[i]}</div>`;
        }
        html += '</div>';
    }

    html += '</div>';
    return html;
}

// Load arena results for a date
async function loadArenaResults(date) {
    const resultsEl = document.getElementById('family-results');
    const targetWordSection = document.getElementById('target-word-section');
    const targetWordEl = document.getElementById('target-word');

    resultsEl.innerHTML = '<div class="no-results">Loading...</div>';
    targetWordSection.style.display = 'none';

    try {
        const res = await fetch(`/api/games/wordle/arena?date=${date}`);

        if (res.status === 403) {
            resultsEl.innerHTML = `
                <div class="locked-message">
                    <h3>Locked</h3>
                    <p>Complete ${date === getTodayDate() ? "today's" : "this day's"} Wordle puzzle first to see family results.</p>
                    <a href="/games/wordle.html" class="btn btn-primary" style="margin-top: 1rem;">Play Wordle</a>
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

        // Show target word
        if (data.targetWord) {
            targetWordEl.textContent = data.targetWord;
            targetWordSection.style.display = 'block';
        }

        // Render results
        let html = '';
        for (const result of data.results) {
            html += `
                <div class="player-result">
                    <div class="player-header">
                        <span class="player-name">${result.username}</span>
                        <span class="player-status ${result.won ? 'won' : 'lost'}">
                            ${result.won ? `Solved in ${result.guesses.length}` : 'Failed'}
                        </span>
                    </div>
                    ${renderMiniBoard(result.guesses, data.targetWord)}
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
        // Fetch server date first to ensure timezone consistency
        await fetchServerDate();

        // Check if a specific date was requested via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const requestedDate = urlParams.get('date');

        if (requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
            // Validate the date isn't in the future
            const today = getTodayDate();
            currentDate = requestedDate <= today ? requestedDate : today;
        } else {
            currentDate = getTodayDate();
        }

        updateNavigation();
        loadArenaResults(currentDate);
    }
}

init();
