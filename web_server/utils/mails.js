const inboxFilters = {
        // Fetch all mails belonging to the user
        all: {
            predicate: (mail, userId) => mail.owner == userId && !mail.isTrashed,
            sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
        },
        // Fetch mails sent to the user
        incoming: {
            predicate: (mail, userId) =>
                mail.owner == userId
                && mail.sentTo
                && Array.isArray(mail.sentTo)
                && mail.sentTo.includes(Number(userId))
                && !mail.isTrashed
                && !mail.isSpam
                && !mail.isDraft,
            sortKey: (mail) => new Date(mail.sentAt).getTime(),
        },
        // Fetch mails sent by the user to others
        sent: {
            predicate: (mail, userId) =>
                mail.owner == userId && !mail.isDraft && mail.from == userId && !mail.isTrashed,
            sortKey: (mail) => new Date(mail.sentAt).getTime(),
        },
        // Fetch mails that marked as a draft (didn't send but were created by user), sorted by creation time
        draft: {
            predicate: (mail, userId) =>
                mail.owner == userId && mail.isDraft && mail.from == userId && !mail.isTrashed,
            sortKey: (mail) => new Date(mail.createdAt).getTime(),
        },
        // Fetch mails that marked with a star (they might be drafts or in the trash)
        star: {
            predicate: (mail, userId) =>
                mail.owner == userId && mail.isStarred === true && !mail.isTrashed,
            sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
        },
        // Fetch mails in the trash
        trash: {
            predicate: (mail, userId) =>
                mail.owner == userId && mail.isTrashed === true,
            sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
        },
        // Fetch mails in the marked as spam
        spam: {
            predicate: (mail, userId) =>
                mail.owner == userId && mail.isSpam === true && !mail.isTrashed,
            sortKey: (mail) => new Date(mail.sentAt).getTime(),
        }
/// TODO get by labels
    };

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

module.exports = {inboxFilters, extractUrls};