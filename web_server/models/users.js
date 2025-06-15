// Author: Yuval Anteby ,dor darmon
const res = require("express/lib/response");
/**
 * User object structure:
 *  id - positive number
 *  fullName - string
 *  mail - string
 *  password
 *  date of birth - string in format of YYYY/MM/DD
 *  image - placeholder string
 *
 */
const users = [
    {
        id: 1,
        fullName: "Yuval Anteby",
        mail: "yuval@gmail.com",
        password: "asd123",
        dateOfBirth: "2025-06-02",
        image: "",
    },
    {
        id: 2,
        fullName: "Dor Darmon",
        mail: "dor@gmail.com",
        password: "asd",
        dateOfBirth: "2025-06-02",
        image: "",
    },
    {
        id: 3,
        fullName: "Roee Chaim",
        mail: "roee@gmail.com",
        password: "123",
        dateOfBirth: "2025-06-02",
        image: "",
    }
]
let countId = users ? users.length : 0;

/**
 *
 * @returns {*[]} All users saved
 */
const getAllUsers = () => users;

/**
 *
 * @param id of a user
 * @returns {{id: Number, fullName: String, mail: String, password: String, dateOfBirth: String, image: *}}
 * user object with the same id
 */
const getUserById = (id) => users.find(user => user.id === id);

/**
 *
 * @param uid id of a user
 * @returns {{id: number | *, fullName: string | *, mail: string | *, image: (string|*), dateOfBirth: (string|*)}}
 */
const getSafeUserById = (uid) => {
    const user = users.find(u => u.id == uid);
    return {
        id: user.id,
        fullName: user.fullName,
        mail: user.mail,
        image: user.image,
        dateOfBirth: user.dateOfBirth,
    }
}

/**
 *
 * @param mail of the user
 * @returns {{id: number | *, fullName: string | *, mail: string | *}} user object with the same mail (without password)
 */
const getUserByMail = (mail) => {
    const user = users.find(user => user.mail === mail);
    return {
        id: user.id,
        fullName: user.fullName,
        mail: user.mail,
    }
}

/**
 *
 * @param  mail
 * @returns {boolean} true if user with the same email address already exists
 */
const userExist = (mail) => {
    return users.find(user => user.mail === mail)
}

/**
 * Checks if a given mail and password match a user to authorize them
 * @param mail mail of user
 * @param password password of user
 * @returns {{id: Number, mail: String, fullName: String, dateOfBirth: String, image: *}}
 * true if mail and password match the user, otherwise false
 */
const isAuthorizeUser = (mail, password) => {
    const u = users.find(user => user.mail === mail && user.password === password);
    if (!u)
        return undefined;
    return {id: u.id, mail: mail, fullName: u.fullName, dateOfBirth: u.dateOfBirth, image: u.image};
}


/**
 * Creates a new user and save it in RAM only
 * @param fullName full name of the user
 * @param mail desired mail address
 * @param password string to guard mail
 * @param dateOfBirth date of birth in format YEAR/MONTH/DAY
 * @param image profile image
 * @returns {{id, fullName, mail, password, dateOfBirth, image}} the object of the new user
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

/**
 * Update user's attribute (that we allow changing)
 * @param {number|string} id id of the user
 * @param {string|undefined} password new password
 * @param {string|undefined} image new image URL
 * @returns {number|{id: (number|*), fullName: (string|*), mail: (string|*), image, dateOfBirth: (string|*)}}
 * - code 400 if input is invalid
 * - code 404 if user not found
 * - user object with the updated attributes if successfully updated
 */
const updateUser = (id, password, image) => {
    // make sure we received valid input
    if (!id || (!password && !image))
        return 400;
    // make sure the user exists
    const index = users.findIndex(user => user.id === id);
    if (index === -1)
        return 404;
    // update the image URL if provided
    if (image)
        users[index].image = image;
    // update a new password if provided
    if (password)
        users[index].password = password;
    // we updated successfully - return the updated user (without the password
    return {
        id: users[index].id,
        fullName: users[index].fullName,
        mail: users[index].mail,
        image: image,
        dateOfBirth: users[index].dateOfBirth,
    };
}

module.exports = {
    getAllUsers,
    getUserById,
    getSafeUserById,
    createUser,
    userExist,
    isAuthorizeUser,
    getUserByMail,
    updateUser
};
