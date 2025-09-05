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
// CORS: allow configured origin + all Vercel preview URLs for this project
const allowedOrigins = new Set([
  CLIENT_ORIGIN,
  'https://reactnodejsauthsystem-hrw9xntp0-lohiths-projects-73e818d8.vercel.app',
  'https://reactnodejsauthsystem-mgu1x3ige-lohiths-projects-73e818d8.vercel.app',
]);
// Matches: https://reactnodejsauthsystem-<previewId>-lohiths-projects-73e818d8.vercel.app
const vercelPreviewRegex = /^https:\/\/reactnodejsauthsystem-[a-z0-9]+-lohiths-projects-73e818d8\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser or same-origin
      if (allowedOrigins.has(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

// DB import & init (added in S4)
const db = require('./db');

// Routers (mounted in S5)
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'React Node.js Auth System API',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        logout: 'POST /auth/logout',
        me: 'GET /auth/me'
      },
      dashboard: 'GET /dashboard (protected)'
    }
  });
});

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
  console.log(`CORS origins (static):`, Array.from(allowedOrigins));
  console.log(`CORS origins (regex):`, vercelPreviewRegex.toString());
  console.log('Environment:', process.env.NODE_ENV);
});
