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
 * Finds and returns a mail with the given id.
 * @param req request
 * @param res response
 * @returns a mail object, if there's no id in input returns 400, if there's no mail with the id returns 404.
 */
const getMailById = (req, res) => {
    // Make sure we got an id in the request
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({error: 'No valid mail ID was given'});

    // Find the mail with the given id
    const mail = Mails.getMailById(id);
    // Return 404 if not found, or a 200 with the mail as a json object
    if (!mail)
        return res.status(404).json({error: `No mail found with ID: ${id}`});
    return res.status(200).json(mail);
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

/**
 * Finds and edits the mail with a given id.
 * @param req request
 * @param res response
 * @returns code 200 with the edits mail, if the user isn't authenticated or mail id wasn't given returns code 400,
 * if the mail wasn't found while editing returns code 400.
 */
const editMailById = (req, res) => {
    // Make sure we got an id in the request
    const mailId = parseInt(req.params.id);
    if (isNaN(mailId))
        return res.status(400).json({error: 'No valid mail ID was given'});
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (isNaN(userId))
        return res.status(400).json({ error: 'User not authenticated'});
    // Get the input params and edit the mail
    const { subject , body, sentTo, readBy, labels, deletedBy} = req.body;
    const mail = Mails.editMail(
        userId, mailId,
        subject || undefined,
        body || undefined,
        sentTo || undefined,
        labels || undefined,
        readBy || undefined,
        deletedBy || undefined
        );
    // Check the outcome of the edit and return a matching result
    if (mail === 404)
        return res.status(404).json({error: 'mail was not found'});
    if (mail === 400)
        return res.status(400).json({error: 'mail doesn\'t belong to user'});
    return res.status(200).json(mail);
}

/**
 * Finds and deletes the mail with a given id.
 * @param req request
 * @param res response
 * @returns code 200 with message of mail deleted if successfully deleted, 404 if mail not found, 400 if missing input
 * or user isn't authenticated or has no access to the mail
 */
const deleteMailById = (req, res) => {
    // Make sure we got an id in the request
    const mailId = parseInt(req.params.id);
    if (isNaN(mailId))
        return res.status(400).json({error: 'No valid mail ID was given'});
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = parseInt(req.header('userId'));
    if (isNaN(userId))
        return res.status(400).json({ error: 'User not authenticated'});
    // Delete the desired mail and return matching result
    const mail = Mails.deleteMail(userId, mailId);
    if (mail === 404)
        return res.status(404).json({error: 'mail was not found'});
    if (mail === 400)
        return res.status(400).json({error: 'mail doesn\'t belong to user'});
    return res.status(204).end();
}
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

module.exports = {getLastMailsOrdered, getMailById, createNewMail, editMailById, deleteMailById, getMailsByQuery};