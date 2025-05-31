// controllers/users.js
const Users = require('../models/users');

const signupUser = (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;
    for (const field of ['fullName', 'mail', 'password', 'dateOfBirth']) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }
    if (Users.userExist(mail)) {
        return res.status(400).json({ error: 'mail already exists' });
    }
    const newUser = Users.createUser(fullName, mail, password, dateOfBirth, image);
    const { password: pw, ...safeUser } = newUser;
    return res.status(201).json(safeUser);
};

const getUser = (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = Users.getUserById(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
};

const loginUser = (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) {
        return res.status(400).json({ error: 'mail and password required' });
    }
    const user = Users.isAuthorizeUser(mail, password);
    if (!user) {
        return res.status(401).json({ error: 'wrong mail or password' });
    }
    return res.status(200).json({ id: user.id });
};

module.exports = { signupUser, getUser, loginUser };
