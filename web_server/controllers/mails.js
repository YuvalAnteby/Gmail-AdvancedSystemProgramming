const Mails = require('../models/mails');

/**
 * Finds and returns a mail with the given id.
 * @param req request
 * @param res response
 * @returns a mail object, if there's no id in input returns 400, if there's no mail with the id returns 404.
 */
const getMailById = (req, res) => {
    // Make sure we got an id in the request
    const id = req.params.id;
    if (!id)
        return res.status(400).json({error: 'No ID was given'});
    // Find the mail with the given id
    const mail = Mails.getMailById(parseInt(id));
    // Return 404 if not found, or a 200 with the mail as a json object
    if (!mail)
        return res.status(404).json({error: `No mail found with ID: ${id}`});
    return res.status(200).json(mail);
}

module.exports = {getMailById};