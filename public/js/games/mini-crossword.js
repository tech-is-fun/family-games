// Mini Crossword Game Logic

// Game state
let puzzle = null;
let answerGrid = null;
let userGrid = [];
let selectedRow = -1;
let selectedCol = -1;
let direction = 'across'; // 'across' or 'down'
let gameOver = false;
let todayDate = '';
let timerInterval = null;
let timerSeconds = 0;
let timerStarted = false;
let cellNumbers = {};
let wordMap = { across: {}, down: {} };

// DOM elements
const gridEl = document.getElementById('grid');
const timerEl = document.getElementById('timer');
const currentClueEl = document.getElementById('current-clue');
const acrossCluesEl = document.getElementById('across-clues');
const downCluesEl = document.getElementById('down-clues');
const modal = document.getElementById('game-modal');

// Mobile: prevent keyboard-open scroll jumps
// When an input is focused, the browser tries to scroll it into view.
// We lock scroll position to prevent that.
let scrollLocked = false;
let lockedScrollY = 0;

function lockScroll() {
    if (window.innerWidth > 600) return;
    scrollLocked = true;
    lockedScrollY = window.scrollY;
}

function unlockScroll() {
    scrollLocked = false;
}

// Restore scroll position if the browser tries to jump
if ('visualViewport' in window) {
    window.visualViewport.addEventListener('resize', () => {
        if (scrollLocked) {
            window.scrollTo(0, lockedScrollY);
        }
    });
    window.visualViewport.addEventListener('scroll', () => {
        if (scrollLocked) {
            window.scrollTo(0, lockedScrollY);
        }
    });
}

window.addEventListener('scroll', () => {
    if (scrollLocked) {
        window.scrollTo(0, lockedScrollY);
    }
});

// Auth check
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

// Compute cell numbering from grid
function computeNumbering(grid) {
    const size = grid.length;
    let num = 0;
    cellNumbers = {};
    wordMap = { across: {}, down: {} };

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '#' || grid[r][c] === '') continue;
            // Check if this cell could contain a letter (not black)
            const isLetter = grid[r][c] !== '#';
            if (!isLetter) continue;

            const startsAcross = (c === 0 || grid[r][c - 1] === '#') &&
                (c + 1 < size && grid[r][c + 1] !== '#');
            const startsDown = (r === 0 || grid[r - 1][c] === '#') &&
                (r + 1 < size && grid[r + 1][c] !== '#');

            if (startsAcross || startsDown) {
                num++;
                cellNumbers[r + ',' + c] = num;

                if (startsAcross) {
                    const cells = [];
                    for (let cc = c; cc < size && grid[r][cc] !== '#'; cc++) {
                        cells.push({ r, c: cc });
                    }
                    wordMap.across[num] = cells;
                }
                if (startsDown) {
                    const cells = [];
                    for (let rr = r; rr < size && grid[rr][c] !== '#'; rr++) {
                        cells.push({ r: rr, c });
                    }
                    wordMap.down[num] = cells;
                }
            }
        }
    }
}

// Local storage for in-progress saves
function getProgressKey() {
    return 'mini-crossword-progress-' + todayDate;
}

function getRevealedCells() {
    const revealed = [];
    document.querySelectorAll('.crossword-cell.revealed').forEach(cell => {
        revealed.push(cell.dataset.row + ',' + cell.dataset.col);
    });
    return revealed;
}

function saveProgress() {
    if (gameOver) return;
    localStorage.setItem(getProgressKey(), JSON.stringify({
        userGrid,
        timerSeconds,
        revealedCells: getRevealedCells(),
        date: todayDate
    }));
}

function loadProgress() {
    const saved = localStorage.getItem(getProgressKey());
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.date === todayDate) return data;
        } catch (e) { }
    }
    return null;
}

function clearProgress() {
    localStorage.removeItem(getProgressKey());
}

// Timer
function startTimer() {
    if (timerStarted || gameOver) return;
    timerStarted = true;
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
        // Auto-save every 5 seconds
        if (timerSeconds % 5 === 0) saveProgress();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Format time for display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return secs + 's';
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Render grid
function renderGrid() {
    gridEl.innerHTML = '';
    const size = puzzle.size;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (answerGrid[r][c] === '#') {
                cell.classList.add('black');
            } else {
                // Cell number
                const numKey = r + ',' + c;
                if (cellNumbers[numKey]) {
                    const numSpan = document.createElement('span');
                    numSpan.className = 'cell-number';
                    numSpan.textContent = cellNumbers[numKey];
                    cell.appendChild(numSpan);
                }

                // Letter input
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'cell-input';
                input.dataset.row = r;
                input.dataset.col = c;
                input.autocomplete = 'off';
                input.autocorrect = 'off';
                input.autocapitalize = 'characters';
                input.spellcheck = false;
                input.value = userGrid[r][c] || '';
                input.readOnly = gameOver;

                input.enterKeyHint = 'next';

                input.addEventListener('focus', () => onCellFocus(r, c));
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onCellClick(r, c);
                });
                input.addEventListener('blur', () => unlockScroll());
                input.addEventListener('input', (e) => onCellInput(e, r, c));
                input.addEventListener('keydown', (e) => onCellKeydown(e, r, c));

                cell.appendChild(input);
            }

            gridEl.appendChild(cell);
        }
    }
}

// Render clues
function renderClues() {
    acrossCluesEl.innerHTML = '';
    downCluesEl.innerHTML = '';

    for (const [num, clue] of Object.entries(puzzle.clues.across)) {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.dataset.direction = 'across';
        div.dataset.num = num;
        div.innerHTML = '<strong>' + num + '.</strong> ' + clue;
        div.addEventListener('click', () => onClueClick('across', num));
        acrossCluesEl.appendChild(div);
    }

    for (const [num, clue] of Object.entries(puzzle.clues.down)) {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.dataset.direction = 'down';
        div.dataset.num = num;
        div.innerHTML = '<strong>' + num + '.</strong> ' + clue;
        div.addEventListener('click', () => onClueClick('down', num));
        downCluesEl.appendChild(div);
    }
}

// Find which word a cell belongs to
function getWordForCell(r, c, dir) {
    for (const [num, cells] of Object.entries(wordMap[dir])) {
        if (cells.some(cell => cell.r === r && cell.c === c)) {
            return { num: parseInt(num), cells };
        }
    }
    return null;
}

// Get the current word's clue number
function getCurrentClueNum() {
    const word = getWordForCell(selectedRow, selectedCol, direction);
    return word ? word.num : null;
}

// Highlight current word and update clue display
function updateHighlights() {
    // Clear all highlights
    document.querySelectorAll('.crossword-cell').forEach(cell => {
        cell.classList.remove('selected', 'highlighted');
    });
    document.querySelectorAll('.clue-item').forEach(item => {
        item.classList.remove('active');
    });

    if (selectedRow < 0 || selectedCol < 0 || gameOver) {
        currentClueEl.textContent = gameOver ? 'Puzzle complete!' : 'Select a cell to begin';
        return;
    }

    const word = getWordForCell(selectedRow, selectedCol, direction);
    if (!word) return;

    // Highlight word cells
    word.cells.forEach(({ r, c }) => {
        const cell = gridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            cell.classList.add('highlighted');
        }
    });

    // Highlight selected cell
    const selectedCell = gridEl.querySelector(`[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
    if (selectedCell) {
        selectedCell.classList.add('selected');
    }

    // Highlight active clue
    const clueNum = word.num;
    const clueItem = document.querySelector(`.clue-item[data-direction="${direction}"][data-num="${clueNum}"]`);
    if (clueItem) {
        clueItem.classList.add('active');
        // Only scroll clue into view on desktop to avoid mobile jumpiness
        if (window.innerWidth > 600) {
            clueItem.scrollIntoView({ block: 'nearest' });
        }
    }

    // Update current clue bar
    const clueText = puzzle.clues[direction][String(clueNum)];
    if (clueText) {
        currentClueEl.textContent = clueNum + ' ' + direction.charAt(0).toUpperCase() + direction.slice(1) + ': ' + clueText;
    }
}

// Cell event handlers
function onCellFocus(r, c) {
    if (gameOver) return;
    lockScroll();
    if (selectedRow === r && selectedCol === c) return;
    selectedRow = r;
    selectedCol = c;
    updateHighlights();
}

function onCellClick(r, c) {
    if (gameOver) return;
    lockScroll();
    if (selectedRow === r && selectedCol === c) {
        // Toggle direction
        const otherDir = direction === 'across' ? 'down' : 'across';
        if (getWordForCell(r, c, otherDir)) {
            direction = otherDir;
        }
    } else {
        selectedRow = r;
        selectedCol = c;
        // Auto-pick direction: prefer the one that has a word here
        if (!getWordForCell(r, c, direction)) {
            const otherDir = direction === 'across' ? 'down' : 'across';
            if (getWordForCell(r, c, otherDir)) {
                direction = otherDir;
            }
        }
    }
    updateHighlights();

    // Focus the input
    const input = gridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
    if (input) input.focus({ preventScroll: true });
}

function isCellRevealed(r, c) {
    const cell = gridEl.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
    return cell && cell.classList.contains('revealed');
}

// Track if keydown already handled the input to avoid double-processing on mobile
let keydownHandledInput = false;

function onCellInput(e, r, c) {
    if (gameOver) return;
    // Skip if keydown already handled this letter
    if (keydownHandledInput) {
        keydownHandledInput = false;
        e.target.value = userGrid[r][c] || '';
        return;
    }
    if (isCellRevealed(r, c)) {
        e.target.value = userGrid[r][c] || '';
        return;
    }
    startTimer();

    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    e.target.value = val;
    userGrid[r][c] = val;

    if (val) {
        advanceToNextCell();
    }

    saveProgress();
    checkCompletion();
}

function onCellKeydown(e, r, c) {
    if (gameOver) return;

    if (e.key === 'Backspace') {
        if (isCellRevealed(r, c)) {
            // Revealed cell - just move back
            moveToPrevCell();
            e.preventDefault();
            return;
        }
        if (userGrid[r][c]) {
            // Clear current cell
            userGrid[r][c] = '';
            const input = gridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
            if (input) input.value = '';
        } else {
            // Move to previous cell
            moveToPrevCell();
        }
        e.preventDefault();
        saveProgress();
        return;
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
            cycleToPrevClue();
        } else {
            cycleToNextClue();
        }
        return;
    }

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveToAdjacentCell(0, 1);
        return;
    }
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveToAdjacentCell(0, -1);
        return;
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveToAdjacentCell(1, 0);
        return;
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveToAdjacentCell(-1, 0);
        return;
    }

    // Letter input - if a letter key is pressed and cell already has content, replace it
    if (/^[a-zA-Z]$/.test(e.key)) {
        if (isCellRevealed(r, c)) {
            e.preventDefault();
            keydownHandledInput = true;
            advanceToNextCell();
            return;
        }
        startTimer();
        e.preventDefault();
        keydownHandledInput = true;
        const val = e.key.toUpperCase();
        userGrid[r][c] = val;
        const input = gridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
        if (input) input.value = val;
        advanceToNextCell();
        saveProgress();
        checkCompletion();
    }
}

// Navigation helpers
function advanceToNextCell() {
    const word = getWordForCell(selectedRow, selectedCol, direction);
    if (!word) return;

    const idx = word.cells.findIndex(c => c.r === selectedRow && c.c === selectedCol);
    if (idx < word.cells.length - 1) {
        const next = word.cells[idx + 1];
        selectCell(next.r, next.c);
    }
}

function moveToPrevCell() {
    const word = getWordForCell(selectedRow, selectedCol, direction);
    if (!word) return;

    const idx = word.cells.findIndex(c => c.r === selectedRow && c.c === selectedCol);
    if (idx > 0) {
        const prev = word.cells[idx - 1];
        selectCell(prev.r, prev.c);
    }
}

function moveToAdjacentCell(dr, dc) {
    const size = puzzle.size;
    let nr = selectedRow + dr;
    let nc = selectedCol + dc;

    while (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        if (answerGrid[nr][nc] !== '#') {
            // Update direction based on movement
            if (dr !== 0) direction = 'down';
            if (dc !== 0) direction = 'across';
            selectCell(nr, nc);
            return;
        }
        nr += dr;
        nc += dc;
    }
}

function cycleToNextClue() {
    const allClues = getAllClueNumbers();
    const currentNum = getCurrentClueNum();
    const currentKey = direction + '-' + currentNum;
    const idx = allClues.findIndex(c => c.key === currentKey);
    const nextIdx = (idx + 1) % allClues.length;
    const next = allClues[nextIdx];
    direction = next.dir;
    const cells = wordMap[next.dir][next.num];
    if (cells && cells.length > 0) {
        selectCell(cells[0].r, cells[0].c);
    }
}

function cycleToPrevClue() {
    const allClues = getAllClueNumbers();
    const currentNum = getCurrentClueNum();
    const currentKey = direction + '-' + currentNum;
    const idx = allClues.findIndex(c => c.key === currentKey);
    const prevIdx = (idx - 1 + allClues.length) % allClues.length;
    const prev = allClues[prevIdx];
    direction = prev.dir;
    const cells = wordMap[prev.dir][prev.num];
    if (cells && cells.length > 0) {
        selectCell(cells[0].r, cells[0].c);
    }
}

function getAllClueNumbers() {
    const clues = [];
    for (const num of Object.keys(wordMap.across)) {
        clues.push({ dir: 'across', num: parseInt(num), key: 'across-' + num });
    }
    for (const num of Object.keys(wordMap.down)) {
        clues.push({ dir: 'down', num: parseInt(num), key: 'down-' + num });
    }
    return clues;
}

function selectCell(r, c) {
    selectedRow = r;
    selectedCol = c;
    updateHighlights();
    const input = gridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
    if (input) input.focus({ preventScroll: true });
}

function onClueClick(dir, num) {
    if (gameOver) return;
    direction = dir;
    const cells = wordMap[dir][parseInt(num)];
    if (cells && cells.length > 0) {
        // Find first empty cell in word, or first cell
        const emptyCell = cells.find(c => !userGrid[c.r][c.c]);
        const target = emptyCell || cells[0];
        selectCell(target.r, target.c);
    }
}

// Hint functions
let hintsUsed = false;

function revealLetter() {
    if (gameOver || selectedRow < 0 || selectedCol < 0) return;
    startTimer();
    hintsUsed = true;
    const answer = answerGrid[selectedRow][selectedCol];
    if (answer === '#') return;
    userGrid[selectedRow][selectedCol] = answer;
    const input = gridEl.querySelector(`input[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
    if (input) {
        input.value = answer;
        input.readOnly = true;
    }
    const cell = gridEl.querySelector(`.crossword-cell[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
    if (cell) cell.classList.add('revealed');
    advanceToNextCell();
    saveProgress();
    checkCompletion();
}

function revealWord() {
    if (gameOver || selectedRow < 0 || selectedCol < 0) return;
    startTimer();
    hintsUsed = true;
    const word = getWordForCell(selectedRow, selectedCol, direction);
    if (!word) return;
    word.cells.forEach(({ r, c }) => {
        userGrid[r][c] = answerGrid[r][c];
        const input = gridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
        if (input) {
            input.value = answerGrid[r][c];
            input.readOnly = true;
        }
        const cell = gridEl.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) cell.classList.add('revealed');
    });
    saveProgress();
    checkCompletion();
}

function checkWord() {
    if (gameOver || selectedRow < 0 || selectedCol < 0) return;
    const word = getWordForCell(selectedRow, selectedCol, direction);
    if (!word) return;
    word.cells.forEach(({ r, c }) => {
        const cell = gridEl.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
        if (!cell) return;
        if (userGrid[r][c] && userGrid[r][c] !== answerGrid[r][c]) {
            cell.classList.add('incorrect');
            setTimeout(() => cell.classList.remove('incorrect'), 1500);
        }
    });
}

// Wire up hint buttons
document.getElementById('reveal-letter-btn').addEventListener('click', revealLetter);
document.getElementById('reveal-word-btn').addEventListener('click', revealWord);
document.getElementById('check-word-btn').addEventListener('click', checkWord);

// Check if puzzle is complete
function checkCompletion() {
    const size = puzzle.size;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (answerGrid[r][c] === '#') continue;
            if (userGrid[r][c] !== answerGrid[r][c]) return;
        }
    }

    // Puzzle complete!
    gameOver = true;
    stopTimer();
    clearProgress();

    // Show completion animation
    document.querySelectorAll('.crossword-cell:not(.black)').forEach(cell => {
        cell.classList.add('correct');
    });

    // Make all inputs readonly
    document.querySelectorAll('.cell-input').forEach(input => {
        input.readOnly = true;
    });

    // Disable hint buttons
    document.getElementById('reveal-letter-btn').disabled = true;
    document.getElementById('reveal-word-btn').disabled = true;
    document.getElementById('check-word-btn').disabled = true;

    // Show arena link
    document.getElementById('arena-link').style.display = 'block';

    // Save result
    saveResult();

    // Show modal after a brief delay
    setTimeout(() => {
        document.getElementById('modal-title').textContent = 'Puzzle Complete!';
        document.getElementById('modal-message').textContent =
            'You solved it in ' + formatTime(timerSeconds) + '!';
        modal.classList.add('show');
    }, 500);

    updateHighlights();
}

// Save result to server
async function saveResult() {
    try {
        await fetch('/api/games/stats/mini-crossword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                won: true,
                score: timerSeconds,
                details: {
                    date: todayDate,
                    time: timerSeconds,
                    grid: userGrid
                }
            })
        });
    } catch (err) {
        console.error('Failed to save result:', err);
    }
}

// Restore completed state
function restoreCompleted(score) {
    gameOver = true;
    timerSeconds = score || 0;
    updateTimerDisplay();

    // Fill grid with answers
    const size = puzzle.size;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            userGrid[r][c] = answerGrid[r][c] === '#' ? '' : answerGrid[r][c];
        }
    }

    renderGrid();

    // Mark all cells correct
    document.querySelectorAll('.crossword-cell:not(.black)').forEach(cell => {
        cell.classList.add('correct');
    });

    // Show arena link
    document.getElementById('arena-link').style.display = 'block';

    // Disable hint buttons
    document.getElementById('reveal-letter-btn').disabled = true;
    document.getElementById('reveal-word-btn').disabled = true;
    document.getElementById('check-word-btn').disabled = true;

    currentClueEl.textContent = 'Puzzle complete! ' + formatTime(timerSeconds);
}

// Modal handlers
document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.classList.remove('show');
});

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
    if (!user) return;

    document.getElementById('username').textContent = user.username;

    // Fetch today's puzzle
    try {
        const res = await fetch('/api/games/mini-crossword/daily');
        if (!res.ok) throw new Error('Failed to fetch puzzle');
        const data = await res.json();

        todayDate = data.date;
        puzzle = data.puzzle;
        answerGrid = data.puzzle.answerGrid || data.puzzle.grid;

        // Compute numbering from answer grid
        computeNumbering(answerGrid);

        if (data.completed) {
            // Already completed - show finished state
            userGrid = answerGrid.map(row => row.map(c => c === '#' ? '' : c));
            renderGrid();
            renderClues();
            restoreCompleted(data.score);
        } else {
            // Initialize empty user grid
            userGrid = answerGrid.map(row => row.map(c => c === '#' ? '' : ''));

            // Try to restore in-progress game
            const saved = loadProgress();
            if (saved && saved.userGrid) {
                userGrid = saved.userGrid;
                timerSeconds = saved.timerSeconds || 0;
                updateTimerDisplay();
            }

            renderGrid();
            renderClues();

            // Restore revealed cells after grid is rendered
            if (saved && saved.revealedCells) {
                saved.revealedCells.forEach(key => {
                    const [r, c] = key.split(',');
                    const cell = gridEl.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"]`);
                    if (cell) {
                        cell.classList.add('revealed');
                        const input = cell.querySelector('.cell-input');
                        if (input) input.readOnly = true;
                    }
                });
            }

            // Select first across clue cell
            const firstAcross = Object.keys(wordMap.across)[0];
            if (firstAcross && wordMap.across[firstAcross].length > 0) {
                const first = wordMap.across[firstAcross][0];
                direction = 'across';
                selectCell(first.r, first.c);
            }
        }
    } catch (err) {
        console.error('Failed to initialize game:', err);
        currentClueEl.textContent = 'Failed to load puzzle. Please try again.';
    }
}

init();
