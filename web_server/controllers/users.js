const User = require('../models/users');

/**
 * Controller function to get a user by their ID.
 * @param req request
 * @param res response
 * @returns {*} JSON object of the user in response, if no user found returns 404
 */
const getUserById = (req, res) => {
    const userId = req.params.id;
    // Make sure the input is valid (number and not empty)
    if (!userId || isNaN(userId)) {
        return res.status(400).json({error: 'Invalid user id'});
    }
    const user = User.getUserById(Number(userId));
    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }
    res.json(user);
}

module.exports = {getUserById};