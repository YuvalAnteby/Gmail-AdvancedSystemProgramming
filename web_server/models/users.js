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
 * @returns {*[]} All users saved
 */
const getAllUsers = () => users;

/**
 *
 * @param id of a user
 * @returns {*} user object with the same id
 */
const getUserById = (id) => users.find(user => user.id === id);

/**
 * Creates a new user and save it in RAM only
 * @param fullName full name of the user
 * @param mail desired mail address
 * @param dateOfBirth date of birth in format YEAR/MONTH/DAY
 * @param image profile image
 */
const createUser = (fullName, mail, dateOfBirth, image) => {

};

module.exports = {getAllUsers, getUserById};