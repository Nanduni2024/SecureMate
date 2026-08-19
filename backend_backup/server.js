const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session'); // Add this line
const helmet = require('helmet');
const xss = require('xss-clean');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://apis.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com"],
            frameSrc: ["'self'", "https://accounts.google.com", "https://www.youtube.com"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

app.use(xss());

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.body) {
        console.log('Body keys:', Object.keys(req.body));
    }
    next();
});

// Session Middleware - IMPORTANT: This must come before passport.initialize() and passport.session()
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret_key', // Use a strong, unique secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true in production with HTTPS
}));
app.use('/uploads', express.static('uploads'));

// Passport init
app.use(passport.initialize());
require('./config/passport')(passport); // This will be updated to use firestoreStore

// Rate Limiting
const { generalLimiter, authLimiter, scanLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Routes
app.get('/', (req, res) => {
    res.send('SecureMate Backend is running');
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'firebase',
        timestamp: new Date().toISOString()
    });
});

// Auth routes with rate limiting
const authRoutes = require('./routes/auth');
app.use('/api/auth', authLimiter, authRoutes);

// Other routes
app.use('/api/users', require('./routes/users'));
app.use('/api/scans', scanLimiter, require('./routes/scans'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/chat', require('./routes/chat'));

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ msg: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Global Error]', err.stack || err.message);
    res.status(err.status || 500).json({
        msg: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

const startServer = async () => {
  app.listen(PORT, '0.0.0.0', () =>
    console.log(`Server running on port ${PORT} (bound to 0.0.0.0)`)
  );
};

module.exports = app;
module.exports.startServer = startServer;

if (!process.env.VERCEL) {
  startServer();
}
