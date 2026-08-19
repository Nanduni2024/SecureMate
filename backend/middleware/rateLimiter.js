const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { msg: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const scanLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { msg: 'Too many scan requests. Please wait a minute before trying again.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    scanLimiter,
    generalLimiter
};
