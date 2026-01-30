const fetch = require('node-fetch');
const cron = require('node-cron');
const { saveNytWordleWord, getNytWordleWord } = require('./db');

// Get Vancouver date string
function getVancouverDateString() {
    const now = new Date();
    return now.toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
}

// NYT Wordle started on June 19, 2021 (day 0)
// We can calculate the puzzle number from the date
function getWordleNumber(dateStr) {
    const startDate = new Date('2021-06-19');
    const targetDate = new Date(dateStr);
    const diffTime = targetDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Try to fetch from NYT's own API (the game loads the word from here)
async function fetchFromNytApi(dateStr) {
    try {
        // NYT Wordle uses this endpoint format
        const url = `https://www.nytimes.com/svc/wordle/v2/${dateStr}.json`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        if (res.ok) {
            const data = await res.json();
            if (data.solution && data.solution.length === 5) {
                return { word: data.solution.toUpperCase(), source: 'nyt-api' };
            }
        }
    } catch (err) {
        console.log('NYT API fetch failed:', err.message);
    }
    return null;
}

// Fallback: Try fetching from a Wordle answer tracking site
async function fetchFromWordleBot(dateStr) {
    try {
        // Try a known wordle answers source
        const puzzleNum = getWordleNumber(dateStr);
        const url = `https://www.rockpapershotgun.com/wordle-answer-today`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        if (res.ok) {
            const html = await res.text();
            // Look for the answer in the page - usually in a format like "Today's Wordle answer is WORD"
            const match = html.match(/today['']?s wordle (?:answer|solution) is[:\s]+([A-Za-z]{5})/i);
            if (match && match[1]) {
                return { word: match[1].toUpperCase(), source: 'rockpapershotgun' };
            }
        }
    } catch (err) {
        console.log('RockPaperShotgun fetch failed:', err.message);
    }
    return null;
}

// Another fallback source
async function fetchFromWordleReplay(dateStr) {
    try {
        const url = `https://wordle-replay.com/api/answer?date=${dateStr}`;
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        if (res.ok) {
            const data = await res.json();
            if (data.answer && data.answer.length === 5) {
                return { word: data.answer.toUpperCase(), source: 'wordle-replay' };
            }
        }
    } catch (err) {
        console.log('Wordle Replay fetch failed:', err.message);
    }
    return null;
}

// Main fetch function - tries multiple sources
async function fetchNytWordleWord(dateStr) {
    console.log(`Fetching NYT Wordle word for ${dateStr}...`);

    // Try NYT's own API first
    let result = await fetchFromNytApi(dateStr);
    if (result) {
        console.log(`Got word from NYT API: ${result.word}`);
        return result;
    }

    // Try Wordle Replay API
    result = await fetchFromWordleReplay(dateStr);
    if (result) {
        console.log(`Got word from Wordle Replay: ${result.word}`);
        return result;
    }

    // Try Rock Paper Shotgun
    result = await fetchFromWordleBot(dateStr);
    if (result) {
        console.log(`Got word from RockPaperShotgun: ${result.word}`);
        return result;
    }

    console.log('All sources failed to fetch NYT Wordle word');
    return null;
}

// Fetch and save today's word
async function fetchAndSaveTodaysWord() {
    const date = getVancouverDateString();

    // Check if we already have today's word
    const existing = await getNytWordleWord(date);
    if (existing) {
        console.log(`Already have NYT word for ${date}: ${existing.word}`);
        return existing;
    }

    const result = await fetchNytWordleWord(date);
    if (result) {
        const saved = await saveNytWordleWord(date, result.word, result.source);
        console.log(`Saved NYT Wordle word for ${date}: ${result.word} (source: ${result.source})`);
        return saved;
    }

    return null;
}

// Manual fetch function (can be called from API)
async function manualFetch(dateStr) {
    const result = await fetchNytWordleWord(dateStr || getVancouverDateString());
    if (result) {
        const saved = await saveNytWordleWord(dateStr || getVancouverDateString(), result.word, result.source);
        return saved;
    }
    return null;
}

// Schedule the cron job - 5:00 AM PST/PDT (America/Los_Angeles)
// Cron format: minute hour day-of-month month day-of-week
function startCronJob() {
    // Run at 5:00 AM Pacific time every day
    cron.schedule('0 5 * * *', async () => {
        console.log('Running scheduled NYT Wordle word fetch at 5am PST...');
        await fetchWithRetry();
    }, {
        timezone: 'America/Los_Angeles'
    });

    // Retry every hour from 6am to 10am if the 5am fetch failed
    cron.schedule('0 6,7,8,9,10 * * *', async () => {
        const date = getVancouverDateString();
        const existing = await getNytWordleWord(date);
        if (!existing) {
            console.log(`Retry fetch at ${new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })} - word not found yet...`);
            await fetchWithRetry();
        }
    }, {
        timezone: 'America/Los_Angeles'
    });

    console.log('NYT Wordle fetcher scheduled: 5:00 AM PST daily, with retries at 6, 7, 8, 9, 10 AM if needed');

    // Also try to fetch on startup if we don't have today's word
    fetchAndSaveTodaysWord().catch(err => {
        console.error('Startup fetch failed:', err);
    });
}

// Fetch with retry logic
async function fetchWithRetry(maxRetries = 3, delayMs = 60000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await fetchAndSaveTodaysWord();
            if (result) {
                console.log(`Successfully fetched word on attempt ${attempt}`);
                return result;
            }
        } catch (err) {
            console.error(`Fetch attempt ${attempt} failed:`, err);
        }

        if (attempt < maxRetries) {
            console.log(`Waiting ${delayMs / 1000} seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    console.error('All fetch attempts failed');
    return null;
}

module.exports = {
    fetchNytWordleWord,
    fetchAndSaveTodaysWord,
    manualFetch,
    startCronJob,
    getVancouverDateString
};
