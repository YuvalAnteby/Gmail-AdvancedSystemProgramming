const Users = require('../models/users');

/**
 * Converts an array of mail addresses to their user ids
 * @param addresses of mails of users
 * @returns {number[]} array of user ids
 */
function convertMailsToIds(addresses) {
    return addresses.map(mailAdd => {
        return Users.getUserById(mailAdd).id;
    });
}

/**
 * Converts an array of user ids to include the full name and mail address
 * @param usersIds array of users' ids
 * @returns {*} array of safe user elements
 */
const usersToFullElement = (usersIds) => {
    return usersIds.map(user => {
        return Users.getSafeUserById(user.id);
    });
}

module.exports = {convertMailsToIds, usersToFullElement};