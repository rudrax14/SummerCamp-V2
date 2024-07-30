const redis = require('../config/redisConnection');
const { login, signup, logout, checkToken } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const express = require('express');
const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);
// Route to check if the token is blacklisted
router.post('/check-token', checkToken);

module.exports = router;
