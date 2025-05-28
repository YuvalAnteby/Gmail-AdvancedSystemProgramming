const Mails = require('../models/mails');
const Blacklist = require('../models/blacklist');
/**
 * Gets the last 50 mails of a user, ordered by the most recent (first) to least recent (last)
 * @param req request
 * @param res response
 * @returns list of ordered by the time sent mails objects, if user isn't authenticated - code 400
 */
const getLastMailsOrdered = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (!userId)
        return res.status(400).json({ error: 'User not authenticated'});
    // limit is 50 according to instructions
    const mails = Mails.getUserMails(userId, 50);
    // we weren't instructed to return 404 if mails is empty, just do a 200 code one
    return res.status(200).json(mails);
}

/**
 * Creates a new mail message, adds the mail to the relevant users.
 * A user has to be authenticated in order to access their mails.
 * If the mail contains a blacklisted URL, the mail will not be created.
 * @param req request
 * @param res response
 * @returns code 201 and the mail as a json object if created a new mail successfully, if the user isn't authenticated
 * or contains a blacklisted URL or encountered any other problem will return a 400 code and a description.
 */
const createNewMail = async (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (!userId)
        return res.status(400).json({ error: 'User not authenticated'});
    // Fetch the mail object's attributes from the request, for later use
    const {subject, body, from, sentTo, sentAt, labels} = req.body;
    if (!from || !sentTo)
        return res.status(400).json({ error: 'Missing basic fields'});
    // Check if the mail contains a blacklisted URL, if it is - don't send it
    const urls = extractUrls(body)
    const blacklisted = await Blacklist.isInBlacklist(urls)
    if (blacklisted)
        return res.status(400).json({ error: 'Mail contains blacklisted URLs'});
    // No blacklisted URLs found, create the new mail
    const newMail = createNewMail(subject, body, from, sentTo, sentAt || new Date(), labels);
    if (!newMail)
        return res.status(400).json({ error: 'Failed to create new mail'});
    return res.status(201).json(newMail);
}

/**
 * Finds and returns URLs from a given string
 * @param text string to check
 * @returns {*|*[]} array of URLs according to regex
 */
function extractUrls(text) {
    if (!text) return [];
    const urlRegex = /(http?:\/\/[^\s]+|www\.[^\s]+)/g;
    return text.match(urlRegex) || [];
}

module.exports = {getLastMailsOrdered, createNewMail};
