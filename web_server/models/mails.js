const {inboxFilters} = require("../utils/mails");
const {mailLabelNames} = require("../utils/labels");
const {mailUserFields} = require("../utils/users");

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
 * isSpam - boolean if the user marked the mail as a spam.
 */
const mails = [
    {
        id: 1,
        owner: 1,
        from: 1,
        sentTo: [1, 2, 3],
        subject: "Project update",
        body: "Here’s what we changed in v2.0...",
        createdAt: new Date('2025-06-03T20:27:11.000Z'),
        sentAt: new Date('2025-06-04T14:08:36.000Z'),
        labels: [],
        isDraft: false,
        isRead: true,
        isStarred: false,
        isTrashed: false,
        isSpam: false,
    },
    {
        id: 2,
        owner: 1,
        from: 1,
        sentTo: [1],
        subject: "Project update",
        body: "Here’s what we changed in v2.0...",
        createdAt: new Date('2025-06-03T20:27:11.000Z'),
        sentAt: new Date('2025-06-04T14:08:36.000Z'),
        labels: [],
        isDraft: false,
        isRead: false,
        isStarred: false,
        isTrashed: false,
        isSpam: false,
    },
    {
        id: 3,
        owner: 2,
        from: 2,
        sentTo: [1],
        subject: "Meeting reminder",
        body: "Don’t forget the team meeting at 9AM tomorrow.",
        createdAt: new Date('2025-06-03T03:15:27.000Z'),
        sentAt: new Date('2025-06-03T11:42:53.000Z'),
        labels: [],
        isDraft: false,
        isRead: true,
        isStarred: false,
        isTrashed: false,
        isSpam: false,
    },
    {
        id: 4,
        owner: 1,
        from: 2,
        sentTo: [1],
        subject: "Meeting reminder",
        body: "Don’t forget the team meeting at 9AM tomorrow.",
        createdAt: new Date('2025-06-03T03:15:27.000Z'),
        sentAt: new Date('2025-06-03T11:42:53.000Z'),
        labels: [1],
        isDraft: false,
        isRead: false,
        isStarred: true,
        isTrashed: false,
        isSpam: false,
    },
    {
        id: 5,
        owner: 1,
        from: 1,
        sentTo: [2],
        subject: "Your daily digest",
        body: "Top tech news today: React 21.0 is out...",
        createdAt: new Date('2025-06-02T18:55:04.000Z'),
        sentAt: "",
        labels: [],
        isDraft: true,
        isRead: false,
        isStarred: false,
        isTrashed: false,
        isSpam: false,
    },
];
let mailId = mails ? mails.length : 0;

/**
 * Gets the last X mails belonging to a user according to different types of inboxes.
 * @param {number} userId user id we want to search for
 * @param {number} limit max amount of mails to receive, by default 50 mails
 * @param {string} inboxType type of inbox to get. e.g. starred or drafts
 * @param {number} page what page of mails to receive, by default gets the first 50 mails
 * @returns {Object} list of ordered mails objects from the most recent to less recent and total mails amount
 */
const getUserMails = (userId, limit = 50, inboxType, page = 1) => {
    // Default to 'all' if inboxType is invalid or missing
    const lowerCasedKey = (typeof inboxType === 'string' && inboxType.toLowerCase()) || 'all';
    const key = inboxFilters.hasOwnProperty(lowerCasedKey) ? lowerCasedKey : 'all';
    const {predicate, sortKey} = inboxFilters[key];
    // Fetch the mails with the chosen predicate and sort key
    const filtered = mails.filter((mail) => predicate(mail, userId));
    const sorted = filtered.sort((a, b) => sortKey(b) - sortKey(a));
    // calculate what mails to get according to the page
    const total = sorted.length;
    const startIdx = (page - 1) * limit;
    const paged = sorted.slice(startIdx, startIdx + limit);
    return {paged, total};
}

/**
 * Creates a new mail as a draft.
 * Lets the user to not include all attributes, marks it accordingly and avoid sending it.
 * @param {number} userId
 * @param {string} subject
 * @param {string} body
 * @param {number[]} sentToIds
 * @returns {{id: number, owner: number, from: number, sentTo: (number[]|*[]), subject: (string|string), body: (string|string), createdAt: string, sentAt: string, labels: *[], isDraft: boolean, isRead: boolean, isStarred: boolean, isTrashed: boolean, isSpam: boolean}}
 */
const saveDraft = (userId, subject, body, sentToIds) => {
    const draft = {
        id: ++mailId,
        owner: Number(userId),
        from: Number(userId),
        sentTo: sentToIds || [],
        subject: subject || "",
        body: body || "",
        createdAt: new Date().toISOString(),
        sentAt: "",
        labels: [],
        isDraft: true,
        isRead: true,
        isStarred: false,
        isTrashed: false,
        isSpam: false,
    };
    mails.push(draft);
    return draft;
}

/**
 * Sends a new mail to all the recipients
 * @param {number} userId of the sender
 * @param {string} subject
 * @param {string} body
 * @param {number[]} sentToIds
 * @returns {{id: number, owner: number, from: number, sentTo, subject: string, body: string, createdAt: string, sentAt: string, labels: *[], isDraft: boolean, isRead: boolean, isStarred: boolean, isTrashed: boolean, isSpam: boolean}|boolean}
 */
const sendNewMail = (userId, subject, body, sentToIds) => {
    try {
        // create the mail for the sender and save it
        const atOwner = {
            id: ++mailId,
            owner: Number(userId),
            from: Number(userId),
            sentTo: sentToIds,
            subject: subject || "",
            body: String(body),
            createdAt: new Date().toISOString(),
            sentAt: new Date().toISOString(),
            labels: [],
            isDraft: false,
            isRead: true,
            isStarred: false,
            isTrashed: false,
            isSpam: false,
        };
        mails.push(atOwner);
        // create the mails for the recipients and save each one
        for (const uid of sentToIds) {
            const mail = {
                id: ++mailId,
                owner: Number(uid),
                from: atOwner.from,
                sentTo: atOwner.sentTo,
                subject: atOwner.subject,
                body: atOwner.body,
                createdAt: atOwner.createdAt,
                sentAt: atOwner.sentAt,
                labels: [],
                isDraft: false,
                isRead: false,
                isStarred: false,
                isTrashed: false,
                isSpam: false,
            }
            mails.push(mail);
        }
        return atOwner;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

/**
 *
 * @param mailId id of a mail to find
 * @returns {*} mail object with the same id
 */
const getMail = (mailId) => mails.find(mail => mail.id === mailId);

/**
 * Updates a draft by optional changing existing attributes with new values
 * @param {number} mailId id of the draft
 * @param {string} subject
 * @param {string} body
 * @param {number[]} sentToIds
 * @returns {*|null} null if the mail isn't found or isn't a draft, otherwise returns the new draft mail object
 */
const updateDraft = (mailId, subject, body, sentToIds) => {
    const index = mails.findIndex(mail => mail.id === mailId);
    if (mails[index] < 0 || !mails[index].isDraft)
        return null;
    // attempt to update the allowed attributes of a draft
    if (subject !== undefined)
        mails[index].subject = subject;
    if (body !== undefined)
        mails[index].body = body;
    if (sentToIds !== undefined)
        mails[index].sentTo = sentToIds;
    return mails[index];
}

/**
 * Edits an existing mail with allowed fields
 * @param {number} mailId id of a mail to edit
 * @param {boolean|null} isRead true if mail was read, otherwise false
 * @param {boolean|null} isStarred true if the mail is marked with a star, otherwise false
 * @param {boolean|null} isTrashed true if the mail is in the trash, otherwise false
 * @param {boolean|null} isSpam true if marked as spam by a user, otherwise false
 * @param {number[]|null} labels id array of new labels for the mail
 * @returns
 * - the new mail object if successfully edited
 * - code 404 if no such email was found
 */
const editSentMail = (mailId, isRead, isStarred, isTrashed, isSpam, labels) => {
    // find the index of the wanted mail
    const index = mails.findIndex(mail => mail.id === mailId);
    // make sure the mail was found
    if (index === -1)
        return 404;
    // check each input, if it's valid edit them in the mail
    if (typeof isRead === 'boolean')
        mails[index].isRead = isRead;
    if (typeof isStarred === 'boolean')
        mails[index].isStarred = isStarred;
    if (typeof isTrashed === 'boolean')
        mails[index].isTrashed = isTrashed;
    if (typeof isSpam === 'boolean')
        mails[index].isSpam = isSpam;
    if (Array.isArray(labels))
        mails[index].labels = labels;
    // return updated mail
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

/**
 * Searches in inbox for a query
 * @param query value to be searched in inbox
 * @param userId the user's id - to search only in their mails
 * @returns {*[]} mails objects with the query value in an attribute
 */
const searchInInbox = (query, userId) => {
    const lowerCased = query.toString().toLowerCase();
    const isNum = !isNaN(Number(query));
    return mails
        .filter(mail => {
            // ensure the user owns the mail
            if (mail.owner != userId)
                return false;
            // check if query in the subject/ body texts
            if (mail.subject.toLowerCase().includes(lowerCased) || mail.body.toLowerCase().includes(lowerCased))
                return true;
            // check if the query is a time (in the format YYYY-MM-DD only)
            const time = (mail.sentAt && mail.sentAt !== "") ? mail.sentAt : mail.createdAt;
            if (time && time.toISOString().includes(lowerCased))
                return true;
            // check if the query is a user's name or mail address
            if (mailUserFields(mail).some(field => field.includes(lowerCased)))
                return true;
            // check if the query is a label's name
            if (isNum && mail.labels && mailLabelNames(userId, mail).some(name => name.includes(lowerCased)))
                return true;
            // not found
            return false;
        });
}

module.exports = {
    getUserMails,
    saveDraft,
    sendNewMail,
    getMail,
    editSentMail,
    updateDraft,
    deleteMail,
    searchInInbox,
};