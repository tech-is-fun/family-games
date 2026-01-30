require('dotenv').config();

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const cron = require('node-cron');
const { pool, initializeDatabase } = require('./db');
const apiRouter = require('./routes/api');
const { startCronJob: startNytWordleFetcher } = require('./nyt-wordle-fetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render/Heroku (required for secure cookies behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// Health check endpoint (for keep-alive pings)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Serve static files with cache control
app.use(express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
        // Short cache for JS files to ensure updates are picked up
        if (filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache'); // Always revalidate HTML
        } else {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day for other assets
        }
    }
}));

// Protected routes - redirect to login if not authenticated
app.get('/home.html', (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
});

app.get('/games/*', (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
});

// Catch-all for SPA-style routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Keep-alive ping to prevent Render from sleeping
function startKeepAlive() {
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL;

    if (RENDER_URL && process.env.NODE_ENV === 'production') {
        // Ping every 5 minutes to keep the server alive
        cron.schedule('*/5 * * * *', async () => {
            try {
                const fetch = require('node-fetch');
                const response = await fetch(`${RENDER_URL}/health`);
                if (response.ok) {
                    console.log(`Keep-alive ping successful at ${new Date().toISOString()}`);
                }
            } catch (err) {
                console.error('Keep-alive ping failed:', err.message);
            }
        });
        console.log('Keep-alive pinger started (every 5 minutes)');
    } else {
        console.log('Keep-alive disabled (not in production or RENDER_EXTERNAL_URL not set)');
    }
}

// Initialize database and start server
async function start() {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            // Start the NYT Wordle word fetcher cron job
            startNytWordleFetcher();
            // Start keep-alive pinger for Render
            startKeepAlive();
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();
