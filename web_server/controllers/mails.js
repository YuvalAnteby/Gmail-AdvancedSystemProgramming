const Mails = require('../models/mails');
const Blacklist = require('../models/blacklist');
const {replaceToUsers} = require("../utils/mails");

/**
 * Gets the last 50 mails of a user, ordered by the most recent (first) to least recent (last)
 * @param req request
 * @param res response
 * @returns
 * - code 200 and list of ordered by the time sent mails objects
 * - code 400 if user isn't authenticated
 */
const getLastMailsOrdered = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = req.headers['user-id'];
    if (!userId)
        return res.status(400).json({error: 'User not authenticated - failed fetching last 50 mails'});
    const inboxType = req.query.inboxType;
    // limit is 50 according to instructions
    const rawMails = Mails.getUserMails(userId, 50, inboxType || undefined);
    // replace in the mails the user ids with user elements so we can show names and emails
    const fullMails = replaceToUsers(rawMails);

    // we weren't instructed to return 404 if mails is empty, just do a 200 code one
    return res.status(200).json(fullMails);
}

/**
 * Finds and returns a mail with the given id.
 * @param req request
 * @param res response
 * @returns
 * - code 200 and a mail object if successful
 * - code 400 if there's no id in input
 * - code 404 if there's no mail with the id
 */
const getMailById = (req, res) => {
    // Make sure we got an id in the request
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({error: 'No valid mail ID was given'});

    // Find the mail with the given id
    const mail = Mails.getMail(id);
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
 * @returns
 * - code 201 and the mail as a json object if created a new mail successfully
 * - code 400 if the user isn't authenticated or contains a blacklisted URL or encountered any other problem
 */
const createNewMail = async (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = req.headers['user-id'];
    if (!userId)
        return res.status(400).json({error: 'User not authenticated - failed creating a new mail'});
    // Fetch the mail object's attributes from the request, for later use
    const from = userId;
    const subject = req.body?.subject;
    const body = req.body?.body;
    const sentTo = req.body?.sentTo;
    const labels = req.body?.labels;
    const sentAt = req.body?.sentAt || new Date();
    if (!from)
        return res.status(400).json({error: 'Missing basic fields - failed creating a new mail'});
    // Check if the mail contains a blacklisted URL, if it is - don't send it
    const urls = extractUrls(body)
    const blacklisted = await Blacklist.isInBlacklist(urls)
    if (blacklisted)
        return res.status(400).json({error: 'Mail contains blacklisted URLs - failed creating a new mail'});
    // No blacklisted URLs found, create the new mail
    const newMail = Mails.createNewMail(subject, body, from, sentTo, sentAt, labels);
    if (!newMail)
        return res.status(400).json({error: 'Failed to create new mail'});
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
 * @returns
 * - code 200 with the edited mail if successful
 * - code 400 if the user isn't authenticated or mail id wasn't given returns or the mail wasn't found
 * - code 404 if the mail wasn't found while editing
 */
const editMailById = (req, res) => {
    // Make sure we got an id in the request
    const mailId = parseInt(req.params.id);
    if (isNaN(mailId))
        return res.status(400).json({error: 'No valid mail ID was given - failed editing a mail'});
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = req.headers['user-id'];
    if (isNaN(userId))
        return res.status(400).json({error: 'User not authenticated - failed editing a mail'});
    // Get the input params and edit the mail
    const subject = req.body?.subject;
    const body = req.body?.body;
    const sentTo = req.body?.sentTo;
    const labels = req.body?.labels;
    const readBy = req.body?.readBy;
    const deletedBy = req.body?.deletedBy;
    // nothing to change was received - end it here
    if (!subject && !body && !sentTo && !labels && !readBy && !deletedBy) {
        return res.status(200).json({msg: "nothing to edit"})
    }
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
        return res.status(404).json({error: 'mail was not found - failed editing a mail'});
    if (mail === 400)
        return res.status(400).json({error: 'mail doesn\'t belong to user - failed editing a mail'});
    return res.status(200).json(mail);
}

/**
 * Finds and deletes the mail with a given id.
 * @param req request
 * @param res response
 * @returns
 * - code 200 with message of mail deleted if successfully deleted
 * - 404 if mail not found
 * - 400 if missing input or user isn't authenticated or has no access to the mail
 */
const deleteMailById = (req, res) => {
    // Make sure we got an id in the request
    const mailId = Number(req.params.id);
    if (isNaN(mailId))
        return res.status(400).json({error: 'No valid mail ID was given'});
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = req.headers['user-id'];
    if (isNaN(userId))
        return res.status(400).json({error: 'User not authenticated'});
    // Delete the desired mail and return matching result
    const mail = Mails.deleteMail(userId, mailId);
    if (mail === 404)
        return res.status(404).json({error: 'mail was not found'});
    if (mail === 400)
        return res.status(400).json({error: 'mail doesn\'t belong to user'});
    return res.status(204).json({msg: "mail deleted"});
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
    const userId = req.headers['user-id'];
    if (!userId)
        return res.status(400).json({error: 'User not authenticated'});
    // If the query is empty - returns 400 bad request
    const query = req.params.query?.trim();
    if (!query)
        return res.status(400).json({error: 'Empty query'});
    // Find the mails and return them, if there are no mails returns an empty array
    const mails = Mails.searchInInbox(query, userId);
    return res.status(200).json(mails);
}

module.exports = {getLastMailsOrdered, getMailById, createNewMail, editMailById, deleteMailById, getMailsByQuery};