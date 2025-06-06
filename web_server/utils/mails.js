const inboxFilters = {
    // Fetch all mails belonging to the user
    all: {
        predicate: (mail, userId) => mail.owner == userId,
        sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
    },
    // Fetch mails sent to the user
    incoming: {
        predicate: (mail, userId) =>
            mail.owner == userId && mail.sentTo && Array.isArray(mail.sentTo) && mail.sentTo.includes(userId),
        sortKey: (mail) => new Date(mail.sentAt).getTime(),
    },
    // Fetch mails sent by the user to others
    sent: {
        predicate: (mail, userId) =>
            mail.owner == userId && !mail.isDraft && mail.from == userId,
        sortKey: (mail) => new Date(mail.sentAt).getTime(),
    },
    // Fetch mails that marked as a draft (didn't send but were created by user), sorted by creation time
    draft: {
        predicate: (mail, userId) =>
            mail.owner == userId && mail.isDraft && mail.from == userId,
        sortKey: (mail) => new Date(mail.createdAt).getTime(),
    },
    // Fetch mails that marked with a star (they might be drafts or in the trash)
    star: {
        predicate: (mail, userId) =>
            mail.owner == userId && mail.isStarred === true,
        sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
    },
    // Fetch mails in the trash
    trash: {
        predicate: (mail, userId) =>
            mail.owner == userId && mail.isTrashed === true,
        sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime(),
    },
    /// TODO get by labels
};

module.exports = {inboxFilters};