const Users = require('../models/users');
const jwt =require('jsonwebtoken');

/**
 * Signs up a new user to the system, if a user with the same already exists it will not create a new one.
 * @param req request
 * @param res response
 * @returns
 * - code 201 and the new user json object if created successfully
 * - code 400 if failed because of an existing mail or a missing attribute
 */
const signupUser = async (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;
    // Check if we have a missing attribute
    for (const field of ['fullName', 'mail', 'password', 'dateOfBirth']) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }
    // Don't create a new user if the mail address is taken already
    if (Users.userExist(mail)) {
        return res.status(400).json({ error: 'mail already exists' });
    }
    const newUser =await Users.createUser(fullName, mail, password, dateOfBirth, image);
    const token=jwt.sign({
        id: newUser.id,
        fullName: newUser.fullName,
        mail: newUser.mail,
        dateOfBirth: newUser.dateOfBirth
    },
        'mySecretKey',
    {expiresIn: '24h'}
        );
    return res.status(201).json({token});
};

/**
 * Get a user by their id
 * @param req request
 * @param res response
 * @returns
 * - code 200 and the user json object (without password) if found
 * - code 404 if user wasn't found
 * - code 400 if got an invalid id
 */
const getUser = (req, res) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = Users.getUserById(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...safeUser } = user;
    return res.status(200).json(safeUser);
};

/**
 * Login the user to the system by using mail and password.
 * @param req request
 * @param res response
 * @returns
 * - code 200 and the user's id if logged in successfully
 * - code 401 if input has wrong mail or password
 * - code 400 if missing mail or password (or both)
 */
const loginUser = async (req, res) => {
    // Get the mail and password from the body (according to instructions)
    const { mail, password } = req.body;
    if (!mail || !password) {
        return res.status(400).json({ error: 'mail and password required' });
    }
    // Check if the mail and password match the saved ones in order to log in
    const user = await Users.isAuthorizeUser(mail, password);
    if (!user) {
        return res.status(401).json({ error: 'wrong mail or password' });
    }
    const token=jwt.sign({
        id: user.id,
        fullName: user.fullName,
        mail: user.mail,
        dateOfBirth: user.dateOfBirth
        },
        'mySecretKey',
        {expiresIn: '24h'}
    );
    return res.status(201).json({token});
};

module.exports = { signupUser, getUser, loginUser };
