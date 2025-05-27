const Mails = require('../models/mails');
/**
 * Gets the last 50 mails of a user, ordered by the most recent (first) to least recent (last)
 * @param req request
 * @param res response
 * @returns {*[]} list of ordered by the time sent mails objects, if user isn't authenticated - code 400
 */
const getLastMailsOrdered = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (!userId)
        return res.status(400)
    // limit is 50 according to instructions
    const mails = Mails.getUserMails(userId, 50);
    // we weren't instructed to return 404 if mails is empty, just do a 200 code one
    return res.status(200).send(mails);
}

/**
 * Creates a new mail message, adds the mail to the relevant users.
 * A user has to be authenticated in order to access their mails.
 * If the mail contains a blacklisted URL, the mail will not be created.
 * @param req request
 * @param res response
 */
const createNewMail = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (!userId)
        return res.status(400)


}

module.exports = {getLastMailsOrdered, createNewMail};