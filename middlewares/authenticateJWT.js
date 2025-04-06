const { verifyToken } = require('../utilities/jwtUtils');

function authenticateJWT(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = decoded;
    next();
}

module.exports = authenticateJWT;