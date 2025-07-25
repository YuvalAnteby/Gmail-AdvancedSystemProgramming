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
    };

/**
 * Finds and returns URLs from a given string
 * @param text string to check
 * @returns {*|*[]} array of URLs according to regex
 */
function extractUrls(text) {
    if (!text) return [];
    const urls = new Set();

    // Remove data:image/... base64 content before processing
    const cleanedText = text.replace(/data:image\/[a-zA-Z]+;base64,[^\s"']+/g, '');


    const plainUrlRegex = /www\.[^\s<>"']+\.(com|net|org|edu|gov|co|il)/gi;
    const plainMatches = cleanedText.match(plainUrlRegex) || [];

    plainMatches.forEach(url => {
        urls.add(url.replace(/[.,;!?]+$/, "")); // remove commas, questions marks etc.
    });

    return [...urls];
}


/**
 * Extracts file names from a mail object.
 * @param {Object} mail mail object.
 * @returns {string[]} Array of file names.
 */
function getFileNamesFromMail(mail) {
    if (!mail || !Array.isArray(mail.files)) {
        return [];
    }
    return mail.files.map(file => file.name);
}


module.exports = {inboxFilters, extractUrls, getFileNamesFromMail};