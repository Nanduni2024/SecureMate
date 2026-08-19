const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports.requireSameUser = function(req, res, next) {
    const authMiddleware = module.exports;
    authMiddleware(req, res, () => {
        if (req.params.id !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        next();
    });
};
