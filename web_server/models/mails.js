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
const mails = [];
let mailId = 0;

/**
 * Gets the last X mails sent and received by a user
 * @param userId user id we want to search for
 * @param limit max amount of mails to receive
 * @returns {any[]} list of mails objects
 */
const getUserMails = (userId, limit) => {
    // filter by user id, then sort by last mails sent/received
    return mails.filter(mail => mail.sentTo.includes(userId) || mail.from === userId)
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
    mails.push(newMail);
    return newMail;
}

/**
 *
 * @param mailId id of a mail to find
 * @returns {*} mail object with the same id
 */
const getMailById = (mailId) => mails.find(mailId);

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
    const index = mails.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return null
    // check each input, if it's valid edit them in the mail
    if (subject !== undefined)
        mails[index].subject = subject;
    if (body !== undefined)
        mails[index].body = body;
    if (sentTo !== undefined && Array.isArray(sentTo))
        mails[index].sentTo = sentTo;
    if (readBy !== undefined && Array.isArray(readBy))
        mails[index].readBy = readBy;
    if (labels !== undefined && Array.isArray(labels))
        mails[index].labels = labels;
    if (deletedBy !== undefined && Array.isArray(deletedBy))
        mails[index].deletedBy = deletedBy;
    return mails[index];
}

/**
 * Deletes a mail
 * @param mailId id of a mail to delete
 * @returns {boolean} true if deleted the mail, otherwise false
 */
const deleteMail = (mailId) => {
    // find the index of the wanted mail
    const index = mails.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return false
    // remove the mail
    mails.splice(index, 1);
    return true;
}

/// TODO according to instructions - need to check if an attribute has the query, many use ids so might need to be changed later on
/**
 * Searches in inbox for a query
 * @param query value to be searched in inbox
 * @param userId the user's id - to search only in their mails
 * @returns {*[]} mails objects with the query value in an attribute
 */
const searchInInbox = (query, userId) => {
    const lowerCased = query.toString().toLowerCase();
    userId = parseInt(userId);
    const isNum = !isNaN(Number(query));
    return mails.filter(
        mail =>
            (mail.from === userId // search 'from' user id
                || mail.sentTo.some(id => id === userId)) // search 'sent to' user ids
            && (
                (mail.subject && mail.subject.toLowerCase().includes(lowerCased)) // search subject string
                || (mail.body && mail.body.toLowerCase().includes(lowerCased)) // search body string
                || (mail.sentAt && new Date(mail.sentAt).toISOString().includes(query)) // search the time sent at
                || (isNum && mail.labels && mail.labels.some(label => label.id === parseInt(query))) // search labels names
                || mail.readBy.some(id => String(id).includes(lowerCased)) // check if it's a user that e
            ));
}

module.exports = {getUserMails, createNewMail, getMailById, editMail, deleteMail, searchInInbox,};