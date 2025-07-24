const jwt = require('jsonwebtoken');

/**
 * Process the given token, make sure it's valid and move to desired route
 * @param req request
 * @param res response
 * @param next next step (route to do)
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({ error: 'Authorization header missing' });
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
    jwt.verify(token, process.env.JWT_SECRET || 'gradingMode', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user; // e.g., { id, fullName, mail, dateOfBirth }
        next();
    });
}

/**
 * Sign a token with user's data
 * @param user user object (without password)
 * @param expiresIn time for the token before expiring, default is 24 hours
 * @returns {*} JWT signed token
 */
function signToken(user, expiresIn = process.env.JWT_EXPIRATION_TIME || '24h') {
    return jwt.sign({
        id: user.id,
        fullName: user.fullName,
        mail: user.mail,
        dateOfBirth: user.dateOfBirth
    }, process.env.JWT_SECRET || 'gradingMode', {expiresIn: expiresIn});
}


module.exports = {authenticateToken, signToken};
