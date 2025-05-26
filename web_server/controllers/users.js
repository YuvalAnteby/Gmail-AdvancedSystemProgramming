//# Author: dor darmon 
const {
    getUserById,
    getAllUsers,
    createUser
} = require('../models/users')

/**
 * Signup is to create new user if all required fields are providded
 */
const signupUser = (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;

    if (!fullName || !mail || !password || !dateOfBirth) {
        return res.status(400).json({
            error:
                'Missing required field'
        });
    }

    // check if email already esists
    if (mailExist)
        return res.status(400).json({error: 'Email already registered'});

    const newUser = createUser(fullName, mail, password, dateOfBirth, image || null)
    return res.status(201).location('/api/users/${newUser.id}').send();
}
 
// check if email already esists
const mailExist=(mail)=>{
    mailExist =getAllUsers().find(user=> user.mail === mail)
}

//Get user by ID
const getUser = (req, res) => {
    const id = Number(req.params.id);
    const user = getUserById(id);

    if (!user) {
        return res.status(404).json({ error: 'Userr not found'});
    }

    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
}

/// TODO: login using email and password 
const loginUser = (req, res) => {

}
module.exports = { signupUser, getUser, loginUser };