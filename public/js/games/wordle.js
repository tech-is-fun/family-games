// Word list (words that can be the answer)
const WORDS = [
    'apple', 'beach', 'brain', 'bread', 'brick', 'bring', 'brown', 'build', 'chair', 'check',
    'clean', 'clear', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count',
    'cover', 'craft', 'crane', 'crash', 'cream', 'cross', 'crowd', 'dance', 'death', 'depth',
    'doubt', 'draft', 'drain', 'drama', 'drank', 'dream', 'dress', 'drink', 'drive', 'drown',
    'early', 'earth', 'eight', 'elect', 'empty', 'enemy', 'enjoy', 'enter', 'equal', 'error',
    'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fancy', 'fault', 'favor',
    'feast', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'flame', 'flash', 'fleet',
    'floor', 'flour', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank',
    'fresh', 'front', 'fruit', 'fully', 'giant', 'given', 'glass', 'globe', 'glory', 'going',
    'grace', 'grade', 'grain', 'grand', 'grant', 'grass', 'grave', 'great', 'green', 'grind',
    'gross', 'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harsh', 'heart',
    'heavy', 'hello', 'hence', 'horse', 'hotel', 'house', 'human', 'ideal', 'image', 'index',
    'inner', 'input', 'issue', 'joint', 'judge', 'juice', 'known', 'labor', 'large',
    'laser', 'later', 'laugh', 'layer', 'learn', 'least', 'leave', 'legal', 'level',
    'light', 'limit', 'links', 'liver', 'local', 'loose', 'lower', 'lucky', 'lunch',
    'magic', 'major', 'maker', 'march', 'match', 'maybe', 'mayor', 'meant', 'media',
    'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor',
    'mount', 'mouse', 'mouth', 'movie', 'music', 'needs', 'nerve', 'never', 'night', 'noise',
    'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other',
    'ought', 'paint', 'panel', 'paper', 'party', 'peace', 'phase', 'phone', 'photo',
    'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point',
    'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof',
    'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid',
    'ratio', 'reach', 'ready', 'refer', 'right', 'river', 'robin', 'roger', 'roman', 'rough',
    'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve',
    'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine',
    'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'since', 'sixth',
    'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke',
    'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
    'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
    'steel', 'steep', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story',
    'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
    'taken', 'taste', 'taxes', 'teach', 'teeth', 'texas', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw',
    'throw', 'tight', 'times', 'tired', 'title', 'today', 'token', 'tools', 'total', 'touch',
    'tough', 'tower', 'track', 'trade', 'train', 'trash', 'treat', 'trend', 'trial', 'tribe',
    'trick', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'union',
    'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video',
    'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which',
    'while', 'white', 'whole', 'whose', 'woman', 'world', 'worry', 'worse', 'worst', 'worth',
    'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth', 'zebra', 'zones'
];


// Extended valid words list loaded from wordle-words.js
const VALID_WORDS = new Set([...WORDS, ...WORDLE_VALID_WORDS]);

// Game state
let targetWord = '';
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let guesses = [];
let todayCompleted = false;
let todayDate = '';
let waitingForStarter = false; // Block input while applying starter word

// Get today's date string (YYYY-MM-DD) - used as fallback
function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Get daily word based on date (deterministic) - used as fallback
function getDailyWordFallback(dateStr) {
    // Simple hash function to get consistent index from date
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % WORDS.length;
    return WORDS[index].toUpperCase();
}

// Fetch daily word from server (ensures consistent word across all users)
async function fetchDailyWord() {
    try {
        const res = await fetch('/api/games/wordle/word', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.ready === false) {
                // NYT word not available yet
                return { date: data.date, ready: false, message: data.message };
            }
            return { date: data.date, word: data.word, ready: true };
        }
    } catch (err) {
        console.error('Failed to fetch daily word from server:', err);
    }
    // Server error - game not available
    return { date: null, ready: false, message: 'Unable to connect to server. Please try again later.' };
}

// DOM elements
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const messageEl = document.getElementById('message');

// Show message to user
function showMessage(text, type = '') {
    messageEl.textContent = text;
    messageEl.className = 'wordle-message ' + type;
}

// Show game not ready message
function showGameNotReady(message) {
    const container = document.querySelector('.wordle-container') || document.querySelector('.container');
    if (container) {
        // Hide keyboard when game not ready
        if (keyboard) keyboard.style.display = 'none';

        // Show not ready message
        modalTitle.textContent = 'Wordle Not Ready';
        modalMessage.innerHTML = `
            <p>${message}</p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray-600);">
                The daily word is fetched from NYT at 5:00 AM PST.
            </p>
        `;
        modal.classList.add('show');

        // Change the close button to refresh
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.textContent = 'Refresh';
            closeBtn.onclick = () => window.location.reload();
        }
    }
}

// Check if current word is valid and show feedback
function checkCurrentWord() {
    if (currentCol < 5) {
        showMessage('');
        return;
    }

    let word = '';
    for (let i = 0; i < 5; i++) {
        word += document.getElementById(`cell-${currentRow}-${i}`).textContent;
    }

    if (VALID_WORDS.has(word.toLowerCase())) {
        showMessage('Valid word - press Enter', 'valid');
    } else {
        showMessage('Not a valid word', 'error');
    }
}

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

// Load stats (stats panel removed for cleaner mobile UI)
function loadStats() {
    // Stats are shown in the arena instead
}

// Save game result
async function saveResult(won, attempts) {
    try {
        await fetch('/api/games/stats/wordle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                won,
                score: won ? attempts : null,
                details: { guesses, targetWord, date: todayDate }
            })
        });
        todayCompleted = true;
        loadStats();
        updateArenaLink();
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

// Check if user already completed today's puzzle
async function checkTodayStatus() {
    try {
        const res = await fetch(`/api/games/wordle/daily?date=${todayDate}`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.completed) {
                todayCompleted = true;
                gameOver = true;
                guesses = data.guesses || [];
                // Restore the board state
                restoreBoard(data.guesses, data.won);
                return true;
            }
        }
    } catch (err) {
        console.error('Failed to check today status:', err);
    }
    return false;
}

// Restore board from previous guesses
function restoreBoard(savedGuesses, won) {
    initBoard();

    for (let row = 0; row < savedGuesses.length; row++) {
        const guess = savedGuesses[row];
        const result = checkGuess(guess);

        for (let col = 0; col < 5; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.textContent = guess[col];
            cell.classList.add('filled', result[col]);

            // Update keyboard
            const key = document.querySelector(`[data-key="${guess[col].toLowerCase()}"]`);
            if (key) {
                if (result[col] === 'correct') {
                    key.classList.remove('present', 'absent');
                    key.classList.add('correct');
                } else if (result[col] === 'present' && !key.classList.contains('correct')) {
                    key.classList.remove('absent');
                    key.classList.add('present');
                } else if (result[col] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                    key.classList.add('absent');
                }
            }
        }
    }

    if (won) {
        showMessage("You already completed today's Wordle!", 'valid');
    } else {
        showMessage(`Today's word was: ${targetWord}`, 'error');
    }
}

// Initialize board
function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'wordle-row';
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'wordle-cell';
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// Starter word modal elements
const starterModal = document.getElementById('starter-modal');
const suggestionButtons = document.getElementById('suggestion-buttons');
const customStarterInput = document.getElementById('custom-starter-input');
const customStarterBtn = document.getElementById('custom-starter-btn');
const starterError = document.getElementById('starter-error');

// Flag to prevent double submission
let isSelectingStarter = false;

// Check and handle starter word
async function checkStarterWord() {
    try {
        const res = await fetch('/api/games/wordle/starter', { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Failed to check starter word:', err);
        return null;
    }
}

// Show starter word selection modal
function showStarterModal(suggestions) {
    isSelectingStarter = false;
    customStarterInput.value = ''; // Clear any previous input
    starterError.style.display = 'none';
    suggestionButtons.innerHTML = '';
    suggestions.forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = word;
        btn.addEventListener('click', () => selectStarterWord(word));
        suggestionButtons.appendChild(btn);
    });
    starterModal.classList.add('show');
}

// Select a starter word (from suggestions or custom)
async function selectStarterWord(word) {
    // Prevent double-clicks
    if (isSelectingStarter) return;
    isSelectingStarter = true;

    word = word.toUpperCase().trim();

    if (word.length !== 5) {
        showStarterError('Word must be exactly 5 letters');
        isSelectingStarter = false;
        return;
    }

    if (!VALID_WORDS.has(word.toLowerCase())) {
        showStarterError('Not a valid word');
        isSelectingStarter = false;
        return;
    }

    // Disable all suggestion buttons while processing
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    });
    customStarterBtn.disabled = true;

    try {
        const res = await fetch('/api/games/wordle/starter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word })
        });

        const data = await res.json();

        if (data.success) {
            // First user chose the starter word - apply it to their game too
            starterModal.classList.remove('show');
            waitingForStarter = true;
            showMessage(`You set today's starter word: ${data.word}`, 'valid');
            setTimeout(() => {
                applyStarterWord(data.word);
                waitingForStarter = false;
            }, 2000);
        } else if (data.alreadySet) {
            // Someone else already set it while this user was choosing - apply it
            starterModal.classList.remove('show');
            waitingForStarter = true;
            showMessage(`${data.chosenBy} already chose: ${data.word}`, 'valid');
            setTimeout(() => {
                applyStarterWord(data.word);
                waitingForStarter = false;
            }, 2000);
        } else if (data.error) {
            showStarterError(data.error);
            isSelectingStarter = false;
            // Re-enable buttons
            document.querySelectorAll('.suggestion-btn').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
            customStarterBtn.disabled = false;
        }
    } catch (err) {
        console.error('Failed to set starter word:', err);
        showStarterError('Failed to set starter word');
        isSelectingStarter = false;
        // Re-enable buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        customStarterBtn.disabled = false;
    }
}

// Show error in starter modal
function showStarterError(message) {
    starterError.textContent = message;
    starterError.style.display = 'block';
    customStarterInput.value = ''; // Clear invalid input
    customStarterInput.focus();
    setTimeout(() => {
        starterError.style.display = 'none';
    }, 3000);
}

// Apply starter word as first guess
function applyStarterWord(word) {
    try {
        if (!word || word.length !== 5) {
            console.error('Invalid starter word:', word);
            showMessage('Error applying starter word', 'error');
            return;
        }

        // Ensure we're at the start of the game
        currentRow = 0;
        currentCol = 0;

        // Clear any existing content in row 0
        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`cell-0-${i}`);
            if (!cell) {
                console.error('Cell not found:', `cell-0-${i}`);
                showMessage('Error applying starter word', 'error');
                return;
            }
            cell.textContent = '';
            cell.classList.remove('filled', 'correct', 'present', 'absent');
        }

        // Fill in the first row with the starter word
        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`cell-0-${i}`);
            cell.textContent = word[i];
            cell.classList.add('filled');
        }
        currentCol = 5;

        // Temporarily allow submission even if waitingForStarter
        const wasWaiting = waitingForStarter;
        waitingForStarter = false;

        // Auto-submit the starter word
        submitGuess();

        // Note: waitingForStarter is reset by the caller after this function
    } catch (err) {
        console.error('Error applying starter word:', err);
        showMessage('Error applying starter word', 'error');
    }
}

// Start new game (daily)
async function startGame() {
    // Fetch word from server (ensures consistent daily word)
    const dailyData = await fetchDailyWord();

    // Check if game is ready (NYT word available)
    if (!dailyData.ready) {
        gameOver = true; // Block the game
        initBoard();
        showGameNotReady(dailyData.message || "Today's Wordle is not ready yet. Please check back later.");
        return;
    }

    todayDate = dailyData.date;
    targetWord = dailyData.word;

    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    guesses = [];
    todayCompleted = false;

    // Reset keyboard colors
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });

    // Check if already completed today
    const alreadyDone = await checkTodayStatus();
    if (!alreadyDone) {
        initBoard();
        showMessage('');

        // Check for starter word
        const starterData = await checkStarterWord();
        if (starterData) {
            if (starterData.hasStarter) {
                // Apply existing starter word - show who chose it
                waitingForStarter = true;
                showMessage(`${starterData.chosenBy} chose today's starter: ${starterData.word}`, 'valid');
                setTimeout(() => {
                    applyStarterWord(starterData.word);
                    waitingForStarter = false;
                }, 2000);
            } else {
                // Show modal to pick starter word
                showStarterModal(starterData.suggestions);
            }
        }
    }

    updateArenaLink();
    modal.classList.remove('show');
}

// Add letter to current row
function addLetter(letter) {
    if (gameOver || waitingForStarter || currentCol >= 5) return;

    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = letter;
    cell.classList.add('filled');
    currentCol++;

    checkCurrentWord();
}

// Remove last letter
function removeLetter() {
    if (gameOver || waitingForStarter || currentCol <= 0) return;

    currentCol--;
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = '';
    cell.classList.remove('filled');

    checkCurrentWord();
}

// Submit guess
function submitGuess() {
    if (gameOver || waitingForStarter || currentCol < 5) return;

    // Get current guess
    let guess = '';
    for (let i = 0; i < 5; i++) {
        guess += document.getElementById(`cell-${currentRow}-${i}`).textContent;
    }

    // Check if word is valid
    if (!VALID_WORDS.has(guess.toLowerCase())) {
        showMessage('Not a valid word', 'error');
        return;
    }

    showMessage('');
    guesses.push(guess);

    // Check each letter
    const result = checkGuess(guess);

    // Update cells with colors
    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        cell.classList.add(result[i]);

        // Update keyboard
        const key = document.querySelector(`[data-key="${guess[i].toLowerCase()}"]`);
        if (key) {
            // Only upgrade key status (absent < present < correct)
            if (result[i] === 'correct') {
                key.classList.remove('present', 'absent');
                key.classList.add('correct');
            } else if (result[i] === 'present' && !key.classList.contains('correct')) {
                key.classList.remove('absent');
                key.classList.add('present');
            } else if (result[i] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
                key.classList.add('absent');
            }
        }
    }

    // Check win/lose
    if (guess === targetWord) {
        gameOver = true;
        modalTitle.textContent = 'You Won!';
        modalMessage.textContent = `You guessed the word in ${currentRow + 1} ${currentRow === 0 ? 'try' : 'tries'}!`;
        modal.classList.add('show');
        saveResult(true, currentRow + 1);
    } else if (currentRow >= 5) {
        gameOver = true;
        modalTitle.textContent = 'Game Over';
        modalMessage.textContent = `The word was: ${targetWord}`;
        modal.classList.add('show');
        saveResult(false, 6);
    } else {
        currentRow++;
        currentCol = 0;
    }
}

// Check guess and return result array
function checkGuess(guess) {
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = 'correct';
            targetLetters[i] = null;
            guessLetters[i] = null;
        }
    }

    // Second pass: mark present letters
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

// Handle keyboard input
function handleKey(key) {
    if (key === 'Enter') {
        submitGuess();
    } else if (key === 'Backspace') {
        removeLetter();
    } else if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key.toUpperCase());
    }
}

// Event listeners
keyboard.addEventListener('click', (e) => {
    const key = e.target.dataset.key;
    if (key) {
        handleKey(key);
    }
});

document.addEventListener('keydown', (e) => {
    handleKey(e.key);
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.classList.remove('show');
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
});

// Starter word custom input handlers
customStarterBtn.addEventListener('click', () => {
    selectStarterWord(customStarterInput.value);
});

customStarterInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        selectStarterWord(customStarterInput.value);
    }
});

// Initialize
async function init() {
    const user = await checkAuth();
    if (user) {
        document.getElementById('username').textContent = user.username;
        loadStats();
        startGame();
    }
}

init();
