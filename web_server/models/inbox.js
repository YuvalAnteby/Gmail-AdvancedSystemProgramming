/**
 * mail object structure:
 *  id - positive number now
 *  subject - string
 *  body - string
 *  from - user id (e.g. positive int)
 *  sentTo - list of user ids (e.g. positive ints)
 *  sentAt - timestamp of when message was sent
 *  labels - list of labels set for the mail per user id
 *  readBy - list of user ids of who read it
 *  deletedBy - list of user ids of who deleted it
 */

const inbox = [];
let mailId = 0;
/**
 * label object structure:
 *  id - positive number now
 *  owner - user id of the label's owner
 *  name - label's name
 */
const labels = [];
let labelId = 0;

/**
 * Gets the last X mails sent and received by a user
 * @param userId user id we want to search for
 * @param limit max amount of mails to receive
 * @returns {any[]} list of mails objects
 */
const getUserMails = (userId, limit) => {
    // filter by user id, then sort by last mails sent/received
    return inbox.filter(mail => mail.sentTo.includes(userId) || mail.from === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

/**
 * Creates a new mail and add it to the total inbox
 * @param subject of the mail
 * @param body main text context of the mail
 * @param from user id of the sender
 * @param sentTo list of user ids of receivers
 * @param sentAt timestamp of when sent
 * @param labels list of labels used per user id
 * @returns {{id: number, subject, body, from, sentTo, sentAt, labels, readBy: *[], deletedBy: *[]}|null}
 * new mail object, null if invalid
 */
const createNewMail = (subject, body, from, sentTo, sentAt, labels) => {
    if (!from)
        return null;
    const newMail = {
        id: ++mailId,
        subject: subject,
        body: body,
        from: from,
        sentTo: sentTo,
        sentAt: sentAt,
        labels: labels,
        readBy: [],
        deletedBy: []
    }
    inbox.push(newMail);
    return newMail;
}

/**
 *
 * @param mailId id of a mail to find
 * @returns {*} mail object with the same id
 */
const getMailById = (mailId) => inbox.find(mailId);

/**
 * Edits an existing mail with allowed fields
 * @param mailId id of a mail to edit
 * @param subject new subject
 * @param body new body text
 * @param sentTo new receivers list
 * @param labels new labels for the mail
 * @param readBy new read status list
 * @param deletedBy new deleted status list
 * @returns the new mail object, if no such email was found returns null
 */
const editMail = (mailId, subject, body, sentTo, labels, readBy, deletedBy) => {
    // find the index of the wanted mail
    const index = inbox.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return null
    // check each input, if it's valid edit them in the mail
    if (subject !== undefined)
        inbox[index].subject = subject;
    if (body !== undefined)
        inbox[index].body = body;
    if (sentTo !== undefined && Array.isArray(sentTo))
        inbox[index].sentTo = sentTo;
    if (readBy !== undefined && Array.isArray(readBy))
        inbox[index].readBy = readBy;
    if (labels !== undefined && Array.isArray(labels))
        inbox[index].labels = labels;
    if (deletedBy !== undefined && Array.isArray(deletedBy))
        inbox[index].deletedBy = deletedBy;
    return inbox[index];
}

/**
 * Deletes a mail
 * @param mailId id of a mail to delete
 * @returns {boolean} true if deleted the mail, otherwise false
 */
const deleteMail = (mailId) => {
    // find the index of the wanted mail
    const index = inbox.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return false
    // remove the mail
    inbox.splice(index, 1);
    return true;
}

/**
 * Returns all labels saved
 * @returns {*[]}
 */
const getAllLabels = () => labels

/**
 * Creates a new label
 * @param owner user id of the label's owner
 * @param name name of the label
 * @returns {{id: number, name, owner}|null} null if input is invalid, otherwise the label object
 */
const createNewLabel = (owner, name) => {
    if (!owner || !name)
        return null;
    const newLabel = {
        id: ++labelId,
        name: name,
        owner: owner,
    }
    labels.push(newLabel);
    return newLabel;
}

/**
 *
 * @param id id of a label
 * @returns {*} label object with the same id
 */
const getLabelById = (id) => labels.find(label => label.id === id);

/**
 * Edits the label with new info
 * @param labelId id of a label to edit
 * @param name new name of the label
 * @returns {*|null} if invalid or not found null, otherwise the updated label object
 */
const editLabel = (labelId, name) => {
    if (!labelId || !name)
        return null;
    // search the label with the index
    const index = labels.findIndex(label => label.id === labelId);
    if (index === -1)
        return null;
    labels[index].name = name;
    return labels[index];
}

/**
 * Deletes a label by id
 * @param labelId id of a label to delete
 * @returns {boolean} true if deleted, otherwise false
 */
const deleteLabel = (labelId) => {
    const index = labels.findIndex(label => label.id === labelId);
    if (index === -1)
        return false;
    labels.splice(index, 1);
    return true;
}

const addToBlacklist = (url) => {
    /// TODO send the url to the CPP server and add it to blacklist
}

const deleteFromBlacklist = (url) => {
    /// TODO send the url to the CPP server and remove it from blacklist
}

/// TODO according to instructions - need to check if an attribute has the query, many use ids so might need to be changed later on
/**
 * Searches in inbox for a query
 * @param query value to be searched in inbox
 * @returns {*[]} mails objects with the query value in an attribute
 */
const searchInInbox = (query) => {
    const lowerCased = query.toString().toLowerCase();
    return inbox.filter(
        mail =>
            mail.subject.toLowerCase().includes(lowerCased) // search subject string
            || mail.body.toLowerCase().includes(lowerCased) // search body string
            || String(mail.from).includes(lowerCased) // search 'from' user id
            || mail.sentTo.some(userId => String(userId).includes(query)) // search 'sent to' user ids
            || new Date(mail.sentAt).toISOString().includes(query) // search the time sent at
            || mail.labels.some(label => String(label.id).includes(query)) // search labels names
            || mail.readBy.some(userId => String(userId).includes(query)) //
            || mail.deletedBy.some(userId => String(userId).includes(lowerCased)) // search deleted by user ids
    );
}

module.exports = {
    // mails
    getUserMails,
    createNewMail,
    getMailById,
    editMail,
    deleteMail,
    searchInInbox,
    // labels
    getAllLabels,
    createNewLabel,
    getLabelById,
    editLabel,
    deleteLabel,
    // blacklist
    addToBlacklist,
    deleteFromBlacklist
};