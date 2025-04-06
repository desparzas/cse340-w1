const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable for security

// Generate a JWT
function generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
}

// Verify a JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null; // Invalid token
    }
}

module.exports = { generateToken, verifyToken };