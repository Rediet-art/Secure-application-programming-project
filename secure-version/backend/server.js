// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const { applySecurity, csrfProtection } = require('./middleware/security');
const authRoutes = require('./Rputes/auth');
const eventRoutes = require('./Routes/events');
const logger = require('./logger');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

applySecurity(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session store in MySQL (keeps sessions server-side)
const sessionStore = new MySQLStore({}, pool.promise ? pool.promise() : undefined);

app.use(session({
  key: 'sid',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,   // set to true if using HTTPS
    sameSite: 'lax',
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

// Expose a CSRF token endpoint for AJAX frontends
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes (csrf protection applied where needed in routes)
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

// basic health
app.get('/', (req, res) => res.json({ status: 'secure backend running' }));

app.listen(PORT, () => {
  logger.info(`Secure backend listening on http://localhost:${PORT}`);
  console.log(`Secure backend listening on http://localhost:${PORT}`);
});
