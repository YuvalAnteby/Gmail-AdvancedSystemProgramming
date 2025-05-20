/**
 * mail object structure:
 *  id - positive number
 *  subject - string
 *  body - string
 *  from - user id (e.g. positive int)
 *  to - list of user ids (e.g. positive ints)
 *  sentAt - timestamp of when message was sent
 *  readBy - list of user ids of who read it
 *  deletedBy - list of user ids of who deleted it
 */
const inbox = [];
let countId = 0;

/**
 * Gets the last X mails sent and received by a user
 * @param userId user id we want to search for
 * @param limit max amount of mails to receive
 * @returns {any[]} list of mails objects
 */
const getUsersMails = (userId, limit) => {
    // filter by user id, then sort by last mails sent/received
    return inbox.filter(mail => mail.to.includes(userId) || mail.from === userId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

/**
 * Creates a new mail and add it to the total inbox
 * @param subject of the mail
 * @param body main text context of the mail
 * @param from user id of the sender
 * @param to list of user ids of receivers
 * @param sentAt timestamp of when sent
 * @returns {{id: number, subject, body, from, to, sentAt, readBy: *[], deletedBy: *[]}|null} new mail object,
 * null if invalid
 */
const createNewMail = (subject, body, from, to, sentAt) => {
    if (!from)
        return null;
    const newMail = {
        id: ++countId,
        subject: subject,
        body: body,
        from: from,
        to: to,
        sentAt: sentAt,
        readBy: [],
        deletedBy: []
    }
    inbox.push(newMail);
    return newMail;
}

/**
 * Edits an existing mail with allowed fields
 * @param mailId id of a mail to edit
 * @param subject new subject
 * @param body new body text
 * @param to new receivers list
 * @param readBy new read status list
 * @param deletedBy new deleted status list
 * @returns the new mail object, if no such email was found returns null
 */
const editMail = (mailId, subject, body, to, readBy, deletedBy) => {
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
    if (to !== undefined && Array.isArray(to))
        inbox[index].to = to;
    if (readBy !== undefined && Array.isArray(readBy))
        inbox[index].readBy = readBy;
    if (deletedBy !== undefined && Array.isArray(deletedBy))
        inbox[index].deletedBy = deletedBy;
    return inbox[index];
}

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

module.exports = {getUsersMails, createNewMail, editMail, deleteMail}