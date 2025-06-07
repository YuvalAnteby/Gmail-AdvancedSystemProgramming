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


module.exports = {convertMailsToIds};