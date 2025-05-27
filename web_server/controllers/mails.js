const Mails = require('../models/mails');

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
        return res.status(400).json({error: 'No ID was given'});

    // Find the mail with the given id
    const mail = Mails.getMailById(id);
    // Return 404 if not found, or a 200 with the mail as a json object
    if (!mail)
        return res.status(404).json({error: `No mail found with ID: ${id}`});
    return res.status(200).json(mail);
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
        return res.status(400).json({error: 'No ID was given'});
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

module.exports = {getMailById, editMailById};