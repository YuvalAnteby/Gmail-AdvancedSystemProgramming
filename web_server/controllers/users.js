const Users = require('../models/users');
const { signToken } = require("../utils/authentication");

/**
 * Signs up a new user to the system, if a user with the same
 * mail already exists it will not create a new one.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 *   - 201 and the new user + token if created successfully
 *   - 400 if mail already exists or a required field is missing
 */
const signupUser = async (req, res) => {
    const { fullName, mail, password, dateOfBirth, image } = req.body;

    for (const field of ['fullName', 'mail', 'password', 'dateOfBirth']) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `${field} is required` });
        }
    }

    // Don't create if the mail is already taken
    if (Users.userExist(mail)) {
        return res.status(400).json({ error: 'mail already exists' });
    }

    const newUser = await Users.createUser(fullName, mail, password, dateOfBirth, image);
    const token = signToken(newUser);

    return res.status(201).json({
        token,
        user: {
            id: newUser.id,
            fullName: newUser.fullName,
            mail: newUser.mail,
            dateOfBirth: newUser.dateOfBirth,
            image: newUser.image
        }
    });
};

/**
 * Get a user by their id.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 *   - 200 and the user object (without password)
 *   - 400 if invalid id
 *   - 404 if no user found
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
 * Log in the user using mail and password.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 *   - 200 and a JWT token if credentials are correct
 *   - 400 if mail or password missing
 *   - 401 if wrong mail/password
 */
const loginUser = async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) {
        return res.status(400).json({ error: 'mail and password required' });
    }

    const user = Users.isAuthorizeUser(mail, password);
    if (!user) {
        return res.status(401).json({ error: 'wrong mail or password' });
    }

    const token = signToken(user);
    return res.status(200).json({ token });
};

/**
 * Edit user's image.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 *   - 200 and the updated user if successful
 *   - 400 if invalid user ID or missing/invalid image
 *   - 404 if user not found
 */
const editUser = (req, res) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const image = req.body.image;
    if (image === undefined || image === null) {
        return res.status(400).json({ error: 'Invalid image input' });
    }

    const updated = Users.updateUser(id, undefined, image);
    if (updated === 400) {
        return res.status(400).json({ error: 'error invalid input' });
    }
    if (updated === 404) {
        return res.status(404).json({ error: 'user not found' });
    }

    return res.status(200).json(updated);
};

/**
 * Check if JWT token is valid.
 * (Authentication middleware must run first.)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns 200 and the user payload from the token
 */
const isTokenValid = (req, res) => {
    return res.status(200).json({ user: req.user });
};

/**
 * Search users by fullName or mail.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 *   - 200 and an array of `{ id, name, mail }` (max 10)
 *   - 400 if missing query parameter `q`
 */
const searchUsers = (req, res) => {
    const query = req.query.q?.toLowerCase();
    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    const matched = Users.getAllUsers()
        .filter(user =>
            user.fullName.toLowerCase().includes(query) ||
            user.mail.toLowerCase().includes(query)
        )
        .slice(0, 10)
        .map(user => ({
            id: user.id,
            name: user.fullName,
            mail: user.mail
        }));

    return res.status(200).json(matched);
};

module.exports = {
    signupUser,
    getUser,
    loginUser,
    editUser,
    isTokenValid,
    searchUsers
};
