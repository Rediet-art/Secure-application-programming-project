// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const rateLimit = require('rate-limiter-flexible');
const { csrfProtection } = require('../middleware/security');
const logger = require('../logger');

// simple in-memory rate limiter per IP for login attempts
const { RateLimiterMemory } = rateLimit;
const loginLimiter = new RateLimiterMemory({ points: 5, duration: 60 * 15 }); // 5 attempts / 15 min

// Register - secure: validation, hashed password, prepared statement
router.post('/register',
  [
    body('name').trim().isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 12);
      const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
      const [result] = await pool.execute(sql, [name, email, hashed]);
      logger.info('user_registered', { userId: result.insertId, email });
      res.json({ message: 'User registered' });
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
      logger.error('register_error', { error: err.message });
      res.status(500).json({ error: 'Server error' });
    }
  });

// Login - secure: prepared statements, bcrypt compare, rate-limited, session creation
router.post('/login', csrfProtection, async (req, res) => {
  const ip = req.ip;
  try {
    await loginLimiter.consume(ip);
  } catch (rlRejected) {
    return res.status(429).json({ error: 'Too many login attempts, try later' });
  }

  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      logger.info('failed_login', { email, ip });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      logger.info('failed_login', { userId: user.id, ip });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    logger.info('login_success', { userId: user.id, ip });
    res.json({ message: 'Login successful' });
  } catch (err) {
    logger.error('login_error', { error: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', csrfProtection, (req, res) => {
  const uid = req.session.userId;
  req.session.destroy(err => {
    if (err) {
      logger.error('logout_error', { error: err.message });
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('sid');
    logger.info('logout', { userId: uid });
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;

