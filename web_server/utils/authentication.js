const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    jwt.verify(token, 'mySecretKey', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user; // e.g., { id, fullName, mail, dateOfBirth }
        next();
    });
}

module.exports = authenticateToken;
