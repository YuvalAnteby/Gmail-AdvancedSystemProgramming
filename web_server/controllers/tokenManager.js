// tokenManager

const users = require('../models/users')
const jwt = require('jsonwebtoken')
// need to replace with a key
const key = "my-secret-key"

exports.createToken = (req, res) => {
    // Extract and check for missing fields in request's body
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password are required' });

    const user = users.isAuthorizeUser(username, password);
    if (!user)
        return res.status(404).json({ error: 'User does not exist' });

    const token = jwt.sign({
        id: user.id,
        fullName: user.fullName,
        mail: user.mail,
        dateOfBirth: user.dateOfBirth
    }, key, { expiresIn: '24h' });

    return res.status(201).json({ token, user });
};
