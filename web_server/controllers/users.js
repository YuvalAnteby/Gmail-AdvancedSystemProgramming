//# Author: dor darmon 
const Users = require('../models/users')


/**
 * Signup is to create new user if all required fields are providded
 */
const signupUser = (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;
    for (const field of ['fullName', 'mail', 'password', 'datrofBirth']) {
        if (!data[field]) return res.status(400).json({ error: '${field} is required' });
    }
    // check if email already esists
    if (userExist(mail)) {
        return res.status(400).json({ error: 'email already esists' });
    } else {
        // Create the user
        const newUser = Users.createUser(fullName, mail, password, dateOfBirth, image || null);
        return res.status(201).json(newUser);
    }
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