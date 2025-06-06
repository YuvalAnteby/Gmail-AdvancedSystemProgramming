const {inboxFilters} = require("../utils/mails");

/**
 * When sending an email we will create an element for each user that receives it and the sender.
 * Deleting/ editing will edit only the specific user's element
 * mail object structure:
 * id - positive number now
 * owner - user id of the owner of this specific mail element, there will be identical elements for each receiver
 * and sender, this way we can ensure changed before editing or deleting.
 * from - user id (e.g. positive int)
 * sentTo - list of user ids (e.g. positive ints)
 * subject - string
 * body - string
 * createdAt - timestamp of when draft message created
 * sentAt - timestamp of when message was sent
 * labels - list of labels set for the mail per user id
 * isRead - boolean if user read the mail
 * isStarred - boolean if the user put it as starred
 * isTrashed - boolean if the user moved the mail to trash, deleting from trash will fully delete the mail
 */
const mails = [
    {
        id: 1,
        owner: 1,
        from: 1,
        sentTo: [1],
        subject: "Project update",
        body: "Here’s what we changed in v2.0...",
        createdAt: "2025/06/03",
        sentAt: "2025/06/04",
        labels: [],
        isDraft: false,
        isRead: true,
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 2,
        owner: 1,
        from: 1,
        sentTo: [1],
        subject: "Project update",
        body: "Here’s what we changed in v2.0...",
        createdAt: "2025/06/03",
        sentAt: "2025/06/04",
        labels: [],
        isDraft: false,
        isRead: false,
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 3,
        owner: 2,
        from: 2,
        sentTo: [1],
        subject: "Meeting reminder",
        body: "Don’t forget the team meeting at 9AM tomorrow.",
        createdAt: "2025/06/03",
        sentAt: "2025/06/03",
        labels: [],
        isDraft: false,
        isRead: true,
        isStarred: false,
        isTrashed: false,
    },
    {
        id: 4,
        owner: 1,
        from: 2,
        sentTo: [1],
        subject: "Meeting reminder",
        body: "Don’t forget the team meeting at 9AM tomorrow.",
        createdAt: "2025/06/03",
        sentAt: "2025/06/03",
        labels: [],
        isDraft: false,
        isRead: false,
        isStarred: true,
        isTrashed: false,
    },
    {
        id: 5,
        owner: 1,
        from: 1,
        sentTo: [2],
        subject: "Your daily digest",
        body: "Top tech news today: React 21.0 is out...",
        createdAt: "2025/06/02",
        sentAt: "",
        labels: [],
        isDraft: true,
        is_read: false,
        isStarred: false,
        isTrashed: false,
    },
];
let mailId = mails ? mails.length : 0;

/**
 * Gets the last X mails belonging to a user according to different types of inboxes.
 * @param userId user id we want to search for
 * @param limit max amount of mails to receive
 * @param inboxType type of inbox to get. e.g. starred or drafts
 * @returns {any[]} list of ordered mails objects from the most recent to less recent
 */
const getUserMails = (userId, limit, inboxType) => {
    // Default to 'all' if inboxType is invalid or missing
    const lowerCasedKey = (typeof inboxType === 'string' && inboxType.toLowerCase()) || 'all';
    const key = inboxFilters.hasOwnProperty(lowerCasedKey) ? lowerCasedKey : 'all';
    const {predicate, sortKey} = inboxFilters[key];
    // Fetch the mails with the chosen predicate and sort key
    return mails
        .filter((mail) => predicate(mail, userId))
        .sort((a, b) => sortKey(b) - sortKey(a))
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
const getMail = (mailId) => mails.find(mail => mail.id === mailId);

/**
 * Edits an existing mail with allowed fields
 * @param userId the user doing the operation (authenticated)
 * @param mailId id of a mail to edit
 * @param subject new subject
 * @param body new body text
 * @param sentTo new receivers list
 * @param labels new labels for the mail
 * @param readBy new read status list
 * @param deletedBy new deleted status list
 * @returns
 * - the new mail object if successfully edited
 * - code 404 if no such email was found
 * - code 400 if user has no access to it
 */
const editMail = (userId, mailId, subject, body, sentTo, labels, readBy, deletedBy) => {
    // find the index of the wanted mail
    const index = mails.findIndex(mail => mail.id === mailId);
    // make sure the mail wa s found
    if (index === -1)
        return 404;
    // make sure the user has access to the mail
    if (mails[index].from !== userId && !mails[index].sentTo.includes(userId))
        return 400;
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
 * @param userId id of the user that wants to remove the mail
 * @param mailId id of a mail to delete
 * @returns {Number}
 * - 204 if deleted successfully
 * - 400 if user has no access to it
 * - 404 if mail not found
 */
const deleteMail = (userId, mailId) => {
    // find the index of the wanted mail
    const index = mails.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return 404
    // make sure the user has access to the mail
    if (mails[index].owner != userId)
        return 400;
    // if the mail is a draft no need to send to trash bin, if it's already in the trash - remove it
    if (mails[index].isDraft || mails[index].isTrashed) {
        mails.splice(index, 1);
    } else if (!mails[index].isTrashed) {
        mails[index].isTrashed = true;
    }
    // return matching code either way
    return 204;
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
    const isNum = !isNaN(Number(query));
    return mails.filter(
        mail =>
            (mail.from === userId // search 'from' user id
                || (mail.sentTo && mail.sentTo.some(id => id === userId))) // search 'sent to' user ids
            && (
                (mail.subject && mail.subject.toLowerCase().includes(lowerCased)) // search subject string
                || (mail.body && mail.body.toLowerCase().includes(lowerCased)) // search body string
                || (mail.sentAt && new Date(mail.sentAt).toISOString().includes(query)) // search the time sent at
                || (isNum && mail.labels && mail.labels.some(label => label.id === parseInt(query))) // search labels names
                || (mail.readBy && mail.readBy.some(id => String(id).includes(lowerCased))) // check if it's a user that e
            ));
}

module.exports = {getUserMails, createNewMail, getMail, editMail, deleteMail, searchInInbox,};