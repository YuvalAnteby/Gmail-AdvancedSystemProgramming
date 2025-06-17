const Users = require('../models/users');

/**
 * Converts an array of mail addresses to their user ids
 * @param addresses of mails of users
 * @returns {number[]} array of user ids
 */
function convertMailsToIds(addresses) {
    return addresses.map(mailAdd => {
        return Users.getUserByMail(mailAdd).id;
    });
}

/**
 * Converts an array of user ids to include the full name and mail address
 * @param {number[]} usersIds array of users' ids
 * @returns {*} array of safe user elements
 */
const usersToFullElement = (usersIds) => {
    return usersIds.map(uid => {
        return Users.getSafeUserById(uid);
    });
}

/**
 * @param {Object} mail mails object
 * @returns an array of lowercase strings we can search for:
 *   - sender name
 *   - sender email
 *   - each recipient name
 *   - each recipient email
 */
const mailUserFields = (mail) => {
    const sender = Users.getSafeUserById(mail.from);
    const recipients = (mail.sentTo || [])
        .map(id => Users.getSafeUserById(id));
    const all = [sender, ...recipients];
    return all.flatMap(u => [u.name, u.mail])
        .filter(Boolean)
        .map(s => s.toLowerCase());
};

module.exports = {convertMailsToIds, usersToFullElement, mailUserFields};