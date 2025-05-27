const Mails = require('../models/mails');

/**
 * Gets all the mails with the given query to search in the mails.
 * Will search in several fields of the mails.
 * @param req request
 * @param res response
 * @returns {*} array of mails objects that contains the query, if encountered a problem returns code 400
 * with the description.
 */
const getMailsByQuery = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (!userId)
        return res.status(400).json({ error: 'User not authenticated'});
    // If the query is empty - returns 400 bad request
    const query = req.params.query?.trim();
    if (!query)
        return res.status(400).json({ error: 'Empty query' });
    // Find the mails and return them, if there are no mails returns an empty array
    const mails = Mails.searchInInbox(query, userId);
    return res.status(200).json(mails);
}

module.exports = {getMailsByQuery};