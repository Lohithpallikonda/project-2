// Step S6: Register endpoint with hashing and duplicate check
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Helpers (promise wrappers for sqlite3)
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, email FROM users WHERE email = ? LIMIT 1',
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

function insertUser(email, passwordHash) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

// POST /auth/register — create user
router.post('/register', async (req, res) => {
  try {
    const emailRaw = (req.body?.email || '').trim();
    const password = req.body?.password || '';

    if (!emailRaw || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const email = emailRaw.toLowerCase();

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { id } = await insertUser(email, hash);

    return res.status(201).json({ user: { id, email } });
  } catch (err) {
    console.error('Register error:', err);
    // Unique constraint violation fallback (in case of race)
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper to get user with hash
function getUserWithHash(email) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

// POST /auth/login — verify and set session
router.post('/login', async (req, res) => {
  try {
    const emailRaw = (req.body?.email || '').trim();
    const password = req.body?.password || '';

    if (!emailRaw || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const email = emailRaw.toLowerCase();
    const user = await getUserWithHash(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.email = user.email;

    return res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /auth/logout — destroy session and clear cookie
router.post('/logout', (req, res) => {
  if (!req.session) {
    // No session to destroy
    res.clearCookie('sid', { httpOnly: true, sameSite: 'lax', secure: false });
    return res.status(200).json({ message: 'Logged out' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('sid', { httpOnly: true, sameSite: 'lax', secure: false });
    return res.status(200).json({ message: 'Logged out' });
  });
});

// GET /auth/me — return current session user
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.status(200).json({
      authenticated: true,
      user: { id: req.session.userId, email: req.session.email },
    });
  }
  return res.status(401).json({ authenticated: false, user: null });
});

module.exports = router;
