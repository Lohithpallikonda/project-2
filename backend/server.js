// Step S3: Basic Express server with CORS and health route
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// Config
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session config (S7)
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
app.use(
  session({
    name: 'sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true if serving over HTTPS
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

// DB import & init (added in S4)
const db = require('./db');

// Routers (mounted in S5)
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth guard middleware (S8)
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// Protected route example
app.get('/dashboard', requireAuth, (req, res) => {
  res.status(200).json({
    message: 'Welcome to your dashboard',
    user: { id: req.session.userId, email: req.session.email },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CLIENT_ORIGIN}`);
});
