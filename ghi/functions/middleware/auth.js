const jwt = require('../utils/jwt');

module.exports = function authMiddleware(req, res, next) {
    const headerAuth = req.headers.authorization;
    const token = req.cookies.token ||
    headerAuth ? headerAuth.split(' ')[1] : null;
    if (!token) return res.status(401).json({error: 'Not logged in'});

    try {
        const decoded = jwt.verifyJWT(token);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
};
