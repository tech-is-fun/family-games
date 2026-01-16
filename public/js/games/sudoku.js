// Game state
let puzzle = [];
let solution = [];
let selectedCell = null;
let startTime = null;
let timerInterval = null;
let gameOver = false;

// Difficulty settings (how many cells to remove)
const DIFFICULTY = {
    easy: 35,
    medium: 45,
    hard: 55
};

// DOM elements
const board = document.getElementById('board');
const numberPad = document.getElementById('number-pad');
const timerEl = document.getElementById('timer');
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
        const res = await fetch('/api/games/stats/sudoku');
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
    document.getElementById('stat-won').textContent = stats.games_won || 0;
    const winPct = stats.games_played > 0
        ? Math.round((stats.games_won / stats.games_played) * 100)
        : 0;
    document.getElementById('stat-win-pct').textContent = winPct + '%';

    if (stats.best_score) {
        const mins = Math.floor(stats.best_score / 60);
        const secs = stats.best_score % 60;
        document.getElementById('stat-best').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Save game result
async function saveResult(won, timeSeconds) {
    try {
        await fetch('/api/games/stats/sudoku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                won,
                score: won ? timeSeconds : null,
                details: { difficulty: document.getElementById('difficulty').value }
            })
        });
        loadStats();
    } catch (err) {
        console.error('Failed to save result:', err);
    }
}

// Generate a valid Sudoku solution
function generateSolution() {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));

    function isValid(grid, row, col, num) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    function solve(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (const num of nums) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solve(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve(grid);
    return grid;
}

// Shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Create puzzle from solution
function createPuzzle(solution, cellsToRemove) {
    const puzzle = solution.map(row => [...row]);
    const positions = [];

    for (let i = 0; i < 81; i++) {
        positions.push(i);
    }

    const shuffled = shuffleArray(positions);

    for (let i = 0; i < cellsToRemove; i++) {
        const pos = shuffled[i];
        const row = Math.floor(pos / 9);
        const col = pos % 9;
        puzzle[row][col] = 0;
    }

    return puzzle;
}

// Initialize board
function initBoard() {
    board.innerHTML = '';

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.index = i;

        const row = Math.floor(i / 9);
        const col = i % 9;

        if (puzzle[row][col] !== 0) {
            cell.textContent = puzzle[row][col];
            cell.classList.add('given');
        }

        cell.addEventListener('click', () => selectCell(i));
        board.appendChild(cell);
    }
}

// Select a cell
function selectCell(index) {
    if (gameOver) return;

    const row = Math.floor(index / 9);
    const col = index % 9;

    // Can't select given cells
    const cell = board.children[index];
    if (cell.classList.contains('given')) return;

    // Deselect previous
    if (selectedCell !== null) {
        board.children[selectedCell].classList.remove('selected');
    }

    selectedCell = index;
    cell.classList.add('selected');
}

// Set number in selected cell
function setNumber(num) {
    if (selectedCell === null || gameOver) return;

    const row = Math.floor(selectedCell / 9);
    const col = selectedCell % 9;
    const cell = board.children[selectedCell];

    if (cell.classList.contains('given')) return;

    puzzle[row][col] = num;
    cell.textContent = num === 0 ? '' : num;
    cell.classList.remove('error');

    // Check if puzzle is complete
    checkCompletion();
}

// Check if puzzle is complete and correct
function checkCompletion() {
    let complete = true;
    let correct = true;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] === 0) {
                complete = false;
            } else if (puzzle[i][j] !== solution[i][j]) {
                correct = false;
            }
        }
    }

    if (complete && correct) {
        gameOver = true;
        clearInterval(timerInterval);

        const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(timeSeconds / 60);
        const secs = timeSeconds % 60;

        modalTitle.textContent = 'Congratulations!';
        modalMessage.textContent = `You completed the puzzle in ${mins}:${secs.toString().padStart(2, '0')}!`;
        modal.classList.add('show');

        saveResult(true, timeSeconds);
    }
}

// Check current progress (highlight errors)
function checkProgress() {
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const cell = board.children[i];

        if (!cell.classList.contains('given') && puzzle[row][col] !== 0) {
            if (puzzle[row][col] !== solution[row][col]) {
                cell.classList.add('error');
            } else {
                cell.classList.remove('error');
            }
        }
    }
}

// Give a hint (fill one cell)
function giveHint() {
    if (gameOver) return;

    // Find empty or wrong cells
    const candidates = [];
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const cell = board.children[i];

        if (!cell.classList.contains('given') && puzzle[row][col] !== solution[row][col]) {
            candidates.push(i);
        }
    }

    if (candidates.length === 0) return;

    // Pick random cell
    const index = candidates[Math.floor(Math.random() * candidates.length)];
    const row = Math.floor(index / 9);
    const col = index % 9;

    puzzle[row][col] = solution[row][col];
    const cell = board.children[index];
    cell.textContent = solution[row][col];
    cell.classList.remove('error');

    checkCompletion();
}

// Start new game
function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const cellsToRemove = DIFFICULTY[difficulty];

    solution = generateSolution();
    puzzle = createPuzzle(solution, cellsToRemove);
    selectedCell = null;
    gameOver = false;

    initBoard();

    // Reset timer
    clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    modal.classList.remove('show');
}

// Update timer display
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Event listeners
numberPad.addEventListener('click', (e) => {
    const num = e.target.dataset.num;
    if (num !== undefined) {
        setNumber(parseInt(num));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        setNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setNumber(0);
    }
});

document.getElementById('new-game-btn').addEventListener('click', startGame);
document.getElementById('hint-btn').addEventListener('click', giveHint);
document.getElementById('check-btn').addEventListener('click', checkProgress);
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
