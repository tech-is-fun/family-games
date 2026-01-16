// Word list (common 5-letter words)
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
    'inner', 'input', 'issue', 'joint', 'jones', 'judge', 'juice', 'known', 'labor', 'large',
    'laser', 'later', 'laugh', 'layer', 'learn', 'least', 'leave', 'legal', 'level', 'lewis',
    'light', 'limit', 'links', 'liver', 'living', 'local', 'loose', 'lower', 'lucky', 'lunch',
    'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant', 'media',
    'metal', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor',
    'mount', 'mouse', 'mouth', 'movie', 'music', 'needs', 'nerve', 'never', 'night', 'noise',
    'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other',
    'ought', 'paint', 'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo',
    'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point',
    'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize', 'proof',
    'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid',
    'ratio', 'reach', 'ready', 'refer', 'right', 'river', 'robin', 'roger', 'roman', 'rough',
    'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve',
    'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine',
    'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'simon', 'since', 'sixth',
    'sixty', 'sized', 'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke',
    'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend',
    'split', 'spoke', 'sport', 'staff', 'stage', 'stake', 'stand', 'start', 'state', 'steam',
    'steel', 'steep', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story',
    'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table',
    'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'their',
    'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw',
    'throw', 'tight', 'times', 'tired', 'title', 'today', 'token', 'tools', 'total', 'touch',
    'tough', 'tower', 'track', 'trade', 'train', 'trash', 'treat', 'trend', 'trial', 'tribe',
    'trick', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'union',
    'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video',
    'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which',
    'while', 'white', 'whole', 'whose', 'woman', 'world', 'worry', 'worse', 'worst', 'worth',
    'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth', 'zebra', 'zones'
];

// Game state
let targetWord = '';
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let guesses = [];

// DOM elements
const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const modal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');

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

// Load stats
async function loadStats() {
    try {
        const res = await fetch('/api/games/stats/wordle');
        if (res.ok) {
            const data = await res.json();
            displayStats(data.stats);
        }
    } catch (err) {
        console.error('Failed to load stats:', err);
    }
}

// Display stats
function displayStats(stats) {
    document.getElementById('stat-played').textContent = stats.games_played || 0;
    const winPct = stats.games_played > 0
        ? Math.round((stats.games_won / stats.games_played) * 100)
        : 0;
    document.getElementById('stat-win-pct').textContent = winPct + '%';
    document.getElementById('stat-streak').textContent = stats.current_streak || 0;
    document.getElementById('stat-best').textContent = stats.best_streak || 0;
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
                details: { guesses, targetWord }
            })
        });
        loadStats();
    } catch (err) {
        console.error('Failed to save result:', err);
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

// Start new game
function startGame() {
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    guesses = [];

    initBoard();

    // Reset keyboard colors
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });

    modal.classList.remove('show');
}

// Add letter to current row
function addLetter(letter) {
    if (gameOver || currentCol >= 5) return;

    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = letter;
    cell.classList.add('filled');
    currentCol++;
}

// Remove last letter
function removeLetter() {
    if (gameOver || currentCol <= 0) return;

    currentCol--;
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = '';
    cell.classList.remove('filled');
}

// Submit guess
function submitGuess() {
    if (gameOver || currentCol < 5) return;

    // Get current guess
    let guess = '';
    for (let i = 0; i < 5; i++) {
        guess += document.getElementById(`cell-${currentRow}-${i}`).textContent;
    }

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

document.getElementById('play-again-btn').addEventListener('click', startGame);

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
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
