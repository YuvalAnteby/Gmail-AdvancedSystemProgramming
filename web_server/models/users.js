/**
 * User object structure:
 *  id - positive number
 *  full name - string
 *  mail address - TODO decide
 *  date of birth - TODO decide
 *  image - placeholder string
 *
 */
const users = []
let countId = 0;

/**
 *
 * @returns {*[]}
 */
const getAllUsers = () => users;

const getUserById = (id) => users.find(user => user.id === id);

const createUser = (fullName, mail, dateOfBirth, image) => {

};

module.exports = {getAllUsers, getUserById};