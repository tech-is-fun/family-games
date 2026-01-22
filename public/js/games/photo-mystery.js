// Photo Mystery Game

// Blur levels (in pixels) - starts very blurry, reduces with each wrong guess
const BLUR_LEVELS = [40, 30, 20, 10, 5, 0];
const BLUR_LABELS = ['Very Blurry', 'Blurry', 'Somewhat Clear', 'Getting Clear', 'Almost Clear', 'Revealed'];
const MAX_GUESSES = 6;

// Game state
let currentPuzzle = null;
let guesses = [];
let blurLevel = 0;
let gameOver = false;
let todayCompleted = false;
let todayDate = '';
let won = false;

// Get today's date string (YYYY-MM-DD)
function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// DOM elements
const mysteryImage = document.getElementById('mystery-image');
const categoryEl = document.getElementById('category');
const guessesCountEl = document.getElementById('guesses-count');
const messageEl = document.getElementById('message');
const blurIndicator = document.getElementById('blur-indicator');
const blurLevelEl = document.getElementById('blur-level');
const guessHistoryEl = document.getElementById('guess-history');
const guessesListEl = document.getElementById('guesses-list');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const inputContainer = document.getElementById('input-container');
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');

// Show message to user
function showMessage(text, type = '') {
    messageEl.textContent = text;
    messageEl.className = 'photo-mystery-message ' + type;
}

// Update blur on image
function updateBlur() {
    const blur = BLUR_LEVELS[blurLevel];
    mysteryImage.style.filter = `blur(${blur}px)`;
    blurLevelEl.textContent = BLUR_LABELS[blurLevel];
}

// Update guesses display
function updateGuessesDisplay() {
    guessesCountEl.textContent = `${guesses.length}/${MAX_GUESSES}`;

    guessesListEl.innerHTML = '';
    guesses.forEach((guess, index) => {
        const li = document.createElement('li');
        li.className = 'guess-item';
        if (index === guesses.length - 1 && won) {
            li.classList.add('correct');
        } else {
            li.classList.add('wrong');
        }
        li.textContent = guess;
        guessesListEl.appendChild(li);
    });

    guessHistoryEl.style.display = guesses.length > 0 ? 'block' : 'none';
}

// Check if guess matches any accepted answer
function checkAnswer(guess) {
    const normalizedGuess = guess.toLowerCase().trim();
    return currentPuzzle.acceptedAnswers.some(answer =>
        answer.toLowerCase() === normalizedGuess
    );
}

// Submit a guess
function submitGuess() {
    if (gameOver) return;

    const guess = guessInput.value.trim();
    if (!guess) {
        showMessage('Please enter a guess', 'error');
        return;
    }

    // Check if already guessed
    if (guesses.some(g => g.toLowerCase() === guess.toLowerCase())) {
        showMessage('You already guessed that!', 'error');
        return;
    }

    guesses.push(guess);
    guessInput.value = '';

    if (checkAnswer(guess)) {
        // Correct!
        won = true;
        gameOver = true;
        blurLevel = BLUR_LEVELS.length - 1; // Fully reveal
        updateBlur();
        updateGuessesDisplay();
        showMessage('Correct!', 'valid');
        endGame(true);
    } else {
        // Wrong guess
        blurLevel = Math.min(blurLevel + 1, BLUR_LEVELS.length - 1);
        updateBlur();
        updateGuessesDisplay();

        if (guesses.length >= MAX_GUESSES) {
            // Out of guesses
            gameOver = true;
            showMessage(`The answer was: ${currentPuzzle.answer}`, 'error');
            endGame(false);
        } else {
            showMessage('Not quite! Try again...', 'error');
        }
    }
}

// End game
async function endGame(didWin) {
    inputContainer.style.display = 'none';

    if (didWin) {
        modalTitle.textContent = 'Correct!';
        modalMessage.textContent = `You guessed "${currentPuzzle.answer}" in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}!`;
    } else {
        modalTitle.textContent = 'Game Over';
        modalMessage.textContent = `The answer was: ${currentPuzzle.answer}`;
    }

    modal.classList.add('show');
    await saveResult(didWin, guesses.length);
    todayCompleted = true;
    updateArenaLink();
}

// Generate share text
function generateShareText() {
    const puzzleNum = currentPuzzle.id;
    const totalGuesses = guesses.length;

    // Create emoji representation
    let emojiRow = '';
    for (let i = 0; i < MAX_GUESSES; i++) {
        if (i < totalGuesses - 1) {
            emojiRow += '\u{1F7E6}'; // Blue square for wrong guesses
        } else if (i === totalGuesses - 1 && won) {
            emojiRow += '\u2705'; // Green checkmark for correct
        } else if (i === totalGuesses - 1 && !won) {
            emojiRow += '\u274C'; // Red X for final wrong guess
        } else {
            emojiRow += '\u2B1C'; // White square for unused
        }
    }

    return `Daily Photo Mystery #${puzzleNum}\nCategory: ${currentPuzzle.category}\n${emojiRow} ${won ? totalGuesses : 'X'}/${MAX_GUESSES}`;
}

// Share button handler
document.getElementById('share-btn').addEventListener('click', async () => {
    const shareText = generateShareText();
    const shareStatus = document.getElementById('share-status');

    try {
        await navigator.clipboard.writeText(shareText);
        shareStatus.textContent = 'Copied!';
        setTimeout(() => { shareStatus.textContent = ''; }, 2000);
    } catch (err) {
        shareStatus.textContent = 'Failed to copy';
    }
});

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

// Load daily puzzle
async function loadDailyPuzzle() {
    try {
        const res = await fetch(`/api/games/photo-mystery/daily?date=${todayDate}`);
        if (!res.ok) throw new Error('Failed to load puzzle');

        const data = await res.json();
        currentPuzzle = data.puzzle;

        mysteryImage.src = currentPuzzle.imageUrl;
        categoryEl.textContent = currentPuzzle.category;

        if (data.completed) {
            // Already completed today
            todayCompleted = true;
            gameOver = true;
            guesses = data.guesses || [];
            won = data.won;
            blurLevel = BLUR_LEVELS.length - 1; // Fully reveal
            updateBlur();
            updateGuessesDisplay();
            inputContainer.style.display = 'none';

            if (won) {
                showMessage(`You already solved this! (${guesses.length} guesses)`, 'valid');
            } else {
                showMessage(`Today's answer was: ${currentPuzzle.answer}`, 'error');
            }
        } else {
            // New game
            blurLevel = 0;
            updateBlur();
            updateGuessesDisplay();
        }

        updateArenaLink();
    } catch (err) {
        console.error('Failed to load puzzle:', err);
        showMessage('Failed to load puzzle. Please refresh.', 'error');
    }
}

// Save game result
async function saveResult(didWin, numGuesses) {
    try {
        await fetch('/api/games/stats/photo-mystery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                won: didWin,
                score: didWin ? numGuesses : null,
                details: {
                    date: todayDate,
                    puzzleId: currentPuzzle.id,
                    guesses: guesses,
                    answer: currentPuzzle.answer,
                    category: currentPuzzle.category
                }
            })
        });
    } catch (err) {
        console.error('Failed to save result:', err);
    }
}

// Update arena link visibility
function updateArenaLink() {
    const arenaLink = document.getElementById('arena-link');
    if (arenaLink) {
        arenaLink.style.display = todayCompleted ? 'block' : 'none';
    }
}

// Event listeners
submitBtn.addEventListener('click', submitGuess);

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.classList.remove('show');
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
        todayDate = getTodayDate();
        await loadDailyPuzzle();
        guessInput.focus();
    }
}

init();
