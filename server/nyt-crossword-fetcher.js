const fetch = require('node-fetch');
const cron = require('node-cron');
const { saveNytMiniCrossword, getNytMiniCrossword } = require('./db');

// Get Vancouver date string
function getVancouverDateString() {
    const now = new Date();
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

// Try to fetch from NYT's crossword API (requires NYT_COOKIE env var)
async function fetchFromNytApi(dateStr) {
    const cookie = process.env.NYT_COOKIE;
    if (!cookie) {
        console.log('NYT_COOKIE not set, skipping NYT API fetch');
        return null;
    }

    try {
        const url = `https://www.nytimes.com/svc/crosswords/v6/puzzle/mini/${dateStr}.json`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Cookie': `NYT-S=${cookie}`
            },
            timeout: 15000
        });

        if (!res.ok) {
            console.log(`NYT API returned ${res.status}`);
            return null;
        }

        const data = await res.json();
        const puzzle = parseNytApiResponse(data);
        if (puzzle) {
            return { puzzle, source: 'nyt-api' };
        }
    } catch (err) {
        console.log('NYT crossword API fetch failed:', err.message);
    }
    return null;
}

// Parse the NYT v6 API response into our puzzle format
function parseNytApiResponse(data) {
    try {
        const body = data.body || data;
        const puzzleData = Array.isArray(body) ? body[0] : body;

        // Extract dimensions
        const dims = puzzleData.dimensions;
        if (!dims) return null;
        const rows = dims.rowCount || dims.height || 5;
        const cols = dims.columnCount || dims.width || 5;

        // Extract cells - flat array of cell objects
        const cells = puzzleData.board?.cells || puzzleData.cells;
        if (!cells || cells.length === 0) return null;

        // Build 2D grid
        const grid = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                const cell = cells[r * cols + c];
                if (!cell || cell.type === 1 || cell.answer === undefined) {
                    row.push('#');
                } else {
                    row.push(cell.answer.toUpperCase());
                }
            }
            grid.push(row);
        }

        // Extract clues
        const clueLists = puzzleData.clueLists || [];
        const clues = { across: {}, down: {} };

        for (const clueList of clueLists) {
            const dir = clueList.name?.toLowerCase() === 'across' ? 'across' : 'down';
            for (const clue of (clueList.clues || [])) {
                const label = clue.label || clue.number;
                // Clue text can be a string or array of text objects
                let text = '';
                if (typeof clue.text === 'string') {
                    text = clue.text;
                } else if (Array.isArray(clue.text)) {
                    text = clue.text.map(t => t.plain || t.text || t).join('');
                }
                if (label && text) {
                    clues[dir][String(label)] = text;
                }
            }
        }

        // Validate we got actual data
        const acrossCount = Object.keys(clues.across).length;
        const downCount = Object.keys(clues.down).length;
        if (acrossCount === 0 || downCount === 0) return null;

        return { grid, clues };
    } catch (err) {
        console.error('Failed to parse NYT API response:', err.message);
        return null;
    }
}

// Try to fetch from xwordinfo.com JSON API
async function fetchFromXWordInfo(dateStr) {
    try {
        // xwordinfo uses M/D/YYYY format
        const [year, month, day] = dateStr.split('-');
        const formattedDate = `${parseInt(month)}/${parseInt(day)}/${year}`;
        const url = `https://www.xwordinfo.com/JSON/Data.aspx?date=${formattedDate}&type=mini`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.xwordinfo.com/'
            },
            timeout: 15000
        });

        if (!res.ok) {
            console.log(`xwordinfo returned ${res.status}`);
            return null;
        }

        const data = await res.json();
        const puzzle = parseXWordInfoResponse(data);
        if (puzzle) {
            return { puzzle, source: 'xwordinfo' };
        }
    } catch (err) {
        console.log('xwordinfo fetch failed:', err.message);
    }
    return null;
}

// Parse xwordinfo.com JSON response
function parseXWordInfoResponse(data) {
    try {
        if (!data.size || !data.grid || !data.clues) return null;

        const rows = data.size.rows || 5;
        const cols = data.size.cols || 5;

        // grid is a 1D array of strings - letters or "." for black cells
        const grid = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                const val = data.grid[r * cols + c];
                row.push(val === '.' ? '#' : val.toUpperCase());
            }
            grid.push(row);
        }

        // clues are arrays like ["1. Clue text", "6. Clue text"]
        const clues = { across: {}, down: {} };

        for (const clueStr of (data.clues.across || [])) {
            const match = clueStr.match(/^(\d+)\.\s*(.+)$/);
            if (match) {
                clues.across[match[1]] = match[2];
            }
        }

        for (const clueStr of (data.clues.down || [])) {
            const match = clueStr.match(/^(\d+)\.\s*(.+)$/);
            if (match) {
                clues.down[match[1]] = match[2];
            }
        }

        const acrossCount = Object.keys(clues.across).length;
        const downCount = Object.keys(clues.down).length;
        if (acrossCount === 0 || downCount === 0) return null;

        return { grid, clues };
    } catch (err) {
        console.error('Failed to parse xwordinfo response:', err.message);
        return null;
    }
}

// Main fetch function - tries multiple sources
async function fetchNytMiniCrossword(dateStr) {
    console.log(`Fetching NYT Mini Crossword for ${dateStr}...`);

    // Try NYT API first (if cookie is available)
    let result = await fetchFromNytApi(dateStr);
    if (result) {
        console.log(`Got mini crossword from NYT API`);
        return result;
    }

    // Try xwordinfo
    result = await fetchFromXWordInfo(dateStr);
    if (result) {
        console.log(`Got mini crossword from xwordinfo`);
        return result;
    }

    console.log('All mini crossword sources failed');
    return null;
}

// Fetch and save today's puzzle
async function fetchAndSaveTodaysPuzzle() {
    const date = getVancouverDateString();

    // Check if we already have today's puzzle
    const existing = await getNytMiniCrossword(date);
    if (existing) {
        console.log(`Already have NYT mini crossword for ${date}`);
        return existing;
    }

    const result = await fetchNytMiniCrossword(date);
    if (result) {
        const saved = await saveNytMiniCrossword(date, result.puzzle, result.source);
        console.log(`Saved NYT mini crossword for ${date} (source: ${result.source})`);
        return saved;
    }

    return null;
}

// Manual fetch function (can be called from API)
async function manualFetch(dateStr) {
    const result = await fetchNytMiniCrossword(dateStr || getVancouverDateString());
    if (result) {
        const saved = await saveNytMiniCrossword(dateStr || getVancouverDateString(), result.puzzle, result.source);
        return saved;
    }
    return null;
}

// Schedule the cron job
function startCronJob() {
    // Run at 5:00 AM Pacific time every day
    cron.schedule('0 5 * * *', async () => {
        console.log('Running scheduled NYT mini crossword fetch at 5am PST...');
        await fetchWithRetry();
    }, {
        timezone: 'America/Los_Angeles'
    });

    // Retry every hour from 6am to 10am if the 5am fetch failed
    cron.schedule('0 6,7,8,9,10 * * *', async () => {
        const date = getVancouverDateString();
        const existing = await getNytMiniCrossword(date);
        if (!existing) {
            console.log(`Retry mini crossword fetch - puzzle not found yet...`);
            await fetchWithRetry();
        }
    }, {
        timezone: 'America/Los_Angeles'
    });

    console.log('NYT Mini Crossword fetcher scheduled: 5:00 AM PST daily, with retries');

    // Also try to fetch on startup if we don't have today's puzzle
    fetchAndSaveTodaysPuzzle().catch(err => {
        console.error('Startup mini crossword fetch failed:', err);
    });
}

// Fetch with retry logic
async function fetchWithRetry(maxRetries = 3, delayMs = 60000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await fetchAndSaveTodaysPuzzle();
            if (result) {
                console.log(`Successfully fetched mini crossword on attempt ${attempt}`);
                return result;
            }
        } catch (err) {
            console.error(`Mini crossword fetch attempt ${attempt} failed:`, err);
        }

        if (attempt < maxRetries) {
            console.log(`Waiting ${delayMs / 1000} seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    console.error('All mini crossword fetch attempts failed');
    return null;
}

module.exports = {
    fetchNytMiniCrossword,
    fetchAndSaveTodaysPuzzle,
    manualFetch,
    startCronJob,
    getVancouverDateString
};
