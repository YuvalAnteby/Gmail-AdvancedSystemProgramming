const Mails = require('../models/mails');
const Blacklist = require('../models/blacklist');
const {extractUrls} = require("../utils/mails");
const {convertMailsToIds, usersToFullElement} = require("../utils/users");
const {convertLabelsToIds, labelsToFullElement} = require("../utils/labels");

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
    const userId = Number(req.user.id);
    if (!userId)
        return res.status(400).json({error: 'User not authenticated - failed fetching last 50 mails'});
    const inboxType = req.query.inboxType || 'all';
    const page = Number(req.query.page) || 1;
    // limit is 50 according to instructions
    const limit = Number(req.query.limit) || 50;

    const labelIdFilter = Number(req.query.label);
    let {paged, total} = Mails.getUserMails(userId, limit, inboxType, page);

    // Filter by label id if provided
    if (!isNaN(labelIdFilter)) {
        paged = paged.filter(mail => mail.labels?.includes(labelIdFilter));
        total = paged.length;
    }

    // replace in the mails the user ids and labels ids with user and label elements so we can show names and emails
    const fullMails = paged.map(m => {
        return {
            ...m,
            from: usersToFullElement([m.from])[0],
            sentTo: usersToFullElement(m.sentTo || []),
            labels: labelsToFullElement(userId, m.labels || [])
        }
    })
    // we weren't instructed to return 404 if mails is empty, just do a 200 code one
    return res.status(200).json(
        {
            mails: fullMails,
            total: total
        }
    );
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
    // get the user's id
    const userId = Number(req.user.id);
    if (!userId)
        return res.status(400).json({error: 'No valid user ID was given'});
    // Find the mail with the given id
    const mail = Mails.getMail(id);
    // Return 404 if not found, or a 200 with the mail as a json object
    if (!mail)
        return res.status(404).json({error: `No mail found with ID: ${id}`});
    // ensure the mail belongs to the user
    if (mail.owner !== userId)
        return res.status(403).json({error: 'mail do not belong to user'});
    return res.status(200).json({
        ...mail,
        from: usersToFullElement([mail.from])[0],
        sentTo: usersToFullElement(mail.sentTo || []),
        labels: labelsToFullElement(userId, mail.labels || [])
    });
}

/**
 * Creates a new mail message, adds the mail to the relevant users.
 * A user has to be authenticated in order to access their mails.
 * If the mail contains a blacklisted URL, the mail will not be created.
 * @param req request
 * @param res response
 * @returns
 * - code 201 and the mail as a json object if created a new mail successfully
 * - code 400 if the user isn't authenticated
 * - code 403 if the mail contains a blacklisted URL
 * - code 500 if the server encountered any other problem
 */
const createNewMail = async (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = Number(req.user.id);
    if (!userId)
        return res.status(400).json({error: 'User not authenticated - failed creating a new mail'});
    try {
        // Fetch the mail object's attributes from the request, for later use
        const {subject, body, sentTo = [], saveAsDraft = false, files = []} = req.body;
        const sentToIds = convertMailsToIds(sentTo);
        // handle this as a draft
        if (saveAsDraft) {
            const draftMail = Mails.saveDraft(userId, subject, body, sentToIds, files)
            return res.status(201).location(`/mails/${draftMail.id}`).json(draftMail);
        }
        // handle this as sending a mail
        // Check if the mail contains a blacklisted URL, if it is - don't send it
        const urls = extractUrls(body)
        const blacklisted = await Blacklist.isInBlacklist(urls)
        if (blacklisted)
            return res.status(403).json({error: 'Mail contains blacklisted URLs - failed creating a new mail'});
        // No blacklisted URLs found, send the new mail
        const newMail = Mails.sendNewMail(userId, subject, body, sentToIds, files);
        if (newMail === false)
            return res.status(500).json({error: 'Failed to create new mail'});
        return res.status(201).location(`/mails/${newMail.id}`).json(newMail);
    } catch (err) {
        return res.status(500).json({error: `error creating mail: ${err.message}`});
    }
}

/**
 * Updates only the allowed attributes of amail, if it's a draft will call another function to update the allowed
 * attributes for a draft.
 * @param req request
 * @param res response
 * @returns
 * - code 200 if mail was edited successfully
 * - code 404 if mail wasn't found
 * - code 400 is user isn't authenticated
 * - code 500 if any other error occurred
 */
const updateMail = (req, res) => {
    // Make sure the user is authenticated, if not - a bad request (400)
    const userId = Number(req.user.id);
    if (!userId)
        return res.status(400).json({error: 'User not authenticated - failed editing a mail'});
    // Make sure we got a mail id in the request, and it belongs to the user
    const mailId = Number(req.params.id);
    if (isNaN(mailId))
        return res.status(400).json({error: 'error no valid mail id was given'});
    const mail = Mails.getMail(mailId);
    if (!mailId || mail.owner !== userId)
        return res.status(404).json({error: 'error mail not found'});
    // edit it as a draft
    if (mail.isDraft)
        return editDraft(req, res, userId, mail);

    // otherwise it’s a mail already sent - only allow flags & labels
    const {isRead, isStarred, isTrashed, isSpam, labels} = req.body || {};
    console.log('labels', labels);
    const labelsIds = convertLabelsToIds(userId, labels || []);
    console.log('labelsIds', labelsIds);
    const updated = Mails.editSentMail(mailId, isRead, isStarred, isTrashed, isSpam, labelsIds);
    console.log('updated', updated);
    if (updated)
        return res.status(200).json(updated);
    if (updated === 404)
        return res.status(404).json({error: 'Email not found'});
    // some other error
    return res.status(500).json(updated);
}

/**
 * Finds and edits the mail with a given id.
 * @param req request
 * @param res response
 * @param {number} userId
 * @param mail draft mail object
 * @returns
 * - code 200 with the edited mail if successful
 * - code 400 if the user isn't authenticated or mail id wasn't given returns or the mail wasn't found
 * - code 404 if the mail wasn't found while editing
 */
const editDraft = async (req, res, userId, mail) => {
    // You can only edit drafts
    if (!mail.isDraft)
        return res.status(400).json({error: 'error only drafts can be updated'});
    // Get the input params and edit the mail
    const {subject, body, sentTo = [], saveAsDraft = true} = req.body;
    const sentToIds = convertMailsToIds(sentTo);

    // just update the fields in this draft
    if (saveAsDraft) {
        const updated = Mails.updateDraft(mail.id, subject, body, sentToIds);
        return res.status(200).json(updated);
    }
    // turn the draft to a new mail
    const urls = extractUrls(body);
    const blacklisted = await Blacklist.isInBlacklist(urls);
    if (blacklisted)
        return res.status(403).json({error: 'error mail contains blacklisted URLs'});
    // delete the draft and send a new mail
    Mails.deleteMail(userId, mail.id);
    const ownerMail = Mails.sendNewMail(userId, subject, body, sentToIds);
    return res.status(201).location(`/mails/${ownerMail.id}`).json(ownerMail);
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
    const userId = Number(req.user.id);
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
    const userId = Number(req.user.id);
    if (!userId)
        return res.status(400).json({error: 'User not authenticated'});
    // If the query is empty - returns 400 bad request
    const query = req.params.query?.trim();
    if (!query)
        return res.status(400).json({error: 'Empty query'});
    // Find the mails and return them, if there are no mails returns an empty array
    const rawMails = Mails.searchInInbox(query, userId);
    const fullMails = rawMails.map(m => {
        return {
            ...m,
            from: usersToFullElement([m.from])[0],
            sentTo: usersToFullElement(m.sentTo || []),
            labels: labelsToFullElement(userId, m.labels || [])
        }
    })
    return res.status(200).json(fullMails);
}

module.exports = {getLastMailsOrdered, getMailById, createNewMail, updateMail, deleteMailById, getMailsByQuery};