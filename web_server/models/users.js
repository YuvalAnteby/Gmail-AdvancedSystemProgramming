//# Author: Yuval Anteby ,dor darmon 
/**
 * User object structure:
 *  id - positive number
 *  full name - string
 *  mail address - TODO decide
 *  password
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
 *
 * @param  mail
 * @returns {boolean} true if user with the gien email address alredy exists
 */
const userExist = (mail) => {
    return users.find(user => user.mail === mail)
}

/**
 * Checks if a given mail and password match a user to authorize them
 * @param mail mail of user
 * @param password password of user
 * @returns {boolean} true if mail and password match the user, otherwise false
 */
const isAuthorizeUser = (mail, password) => {
    const u = users.find(user => user.mail === mail && user.password === password);
    return !!u;

}


/**
 * Creates a new user and save it in RAM only
 * @param fullName full name of the user
 * @param mail desired mail address
 * @param password string to guard mail
 * @param dateOfBirth date of birth in format YEAR/MONTH/DAY
 * @param image profile image
 */
const createUser = (fullName, mail, password, dateOfBirth, image) => {
    const newUser = {
        id: ++countId,
        fullName,
        mail,
        password,
        dateOfBirth,
        image
    };
    users.push(newUser);
    return newUser;
};


module.exports = {getAllUsers, getUserById, createUser, userExist, isAuthorizeUser};
