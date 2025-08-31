const Users = require('../models/users');

/**
 * Converts an array of mail addresses to their user ids
 * @param addresses of mails of users
 * @returns {number[]} array of user ids
 */
async function convertMailsToIds(addresses) {
    const results = await Promise.all(
        (addresses || []).map(async (mailAdd) => {
            const u = await Users.getUserByMail(mailAdd);
            return u ? u.id : undefined;
        })
    );
    return results.filter((v) => typeof v === 'number');
}

/**
 * Converts an array of user ids to include the full name and mail address
 * @param {number[]} usersIds array of users' ids
 * @returns {*} array of safe user elements
 */
const usersToFullElement = async (usersIds) => {
    const results = await Promise.all(
        (usersIds || []).map(async (uid) => Users.getSafeUserById(uid))
    );
    return results.filter(Boolean);
}

/**
 * @param {Object} mail mails object
 * @returns an array of lowercase strings we can search for:
 *   - sender name
 *   - sender email
 *   - each recipient name
 *   - each recipient email
 */
const mailUserFields = async (mail) => {
    const sender = await Users.getSafeUserById(mail.from);
    const recipients = await Promise.all((mail.sentTo || []).map((id) => Users.getSafeUserById(id)));
    const all = [sender, ...recipients].filter(Boolean);
    return all
        .flatMap((u) => [u.name, u.mail])
        .filter(Boolean)
        .map((s) => s.toLowerCase());
};



module.exports = {convertMailsToIds, usersToFullElement, mailUserFields};