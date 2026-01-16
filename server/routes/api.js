const express = require('express');
const authRouter = require('./auth');
const gamesRouter = require('./games');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/games', gamesRouter);

module.exports = router;
