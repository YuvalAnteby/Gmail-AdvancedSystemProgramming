//# Author: dor darmon 
const Users = require('../models/users')

/**
 * Signup is to create new user if all required fields are providded
 */
const signupUser = (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: 'Name is required' });

    } else if (!mail) {
        return res.status(400).json({ error: 'mail is required' });

    } else if (!password) {
        return res.status(400).json({ error: 'password is required' });

    } else if (!dateOfBirth) {
        return res.status(400).json({ error: 'date Of Birth is required' });
    }

    // check if email already esists
    if (mailExist)
        return res.status(400).json({ error: 'email already esists' });

    const newUser = createUser(fullName, mail, password, dateOfBirth, image || null)
    return res.status(201).location('/api/users/${newUser.id}').send();
}

// check if email already esists
const mailExist = (mail) => {
    mailExist =  Users.getAllUsers().find(user => user.mail === mail)
}

//Get user by ID
const getUser = (req, res) => {
    const id = Number(req.params.id);
    const user = Users.getUserById(id);

    if (!user) {
        return res.status(404).json({ error: 'Not Found' });
    }

    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
}

// login using email and password 
const loginUser = (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).json({ error: 'mail and password required' });
    }

    const user = Users.getAllUsers().find(user => user.mail === mail && user.password === password)

    if (!user) {
        return res.status(401).json({ error: 'wrong mail or password' });
    }

    return res.status(200).json({ id: user.id });
}

module.exports = { signupUser, getUser, loginUser };