const Users = require('../models/users');
const {getUserById} = require("../models/users");

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
            && mail.sentTo.includes(userId)
            && !mail.isTrashed,
        sortKey: (mail) => new Date(mail.sentAt).getTime(),
    },
    // Fetch mails sent by the user to others
    sent: {
        predicate: (mail, userId) =>
            mail.owner == userId && !mail.isDraft && mail.from == userId && !mail.isTrashed ,
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
            mail.owner == userId && mail.isStarred === true,
        sortKey: (mail) => new Date(mail.sentAt || mail.createdAt).getTime() && !mail.isTrashed,
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
            mail.owner == userId && mail.isSpam === true,
        sortKey: (mail) => new Date(mail.sentAt).getTime(),
    }
    /// TODO get by labels
};

/**
 * Replaces users ids in a mail with safe user objects (including only id, name, mail)
 * @param rawMails mails with ids instead of user objects
 * @returns {*} mails with user objects instead of user ids in 'from' and 'sentTo'
 */
const replaceToUsers = (rawMails) => {
    return rawMails.map(mail => {
        // replace the 'from' attribute
        const sender = Users.getUserById(mail.from);
        const fromObj = sender
            ? {id: sender.id, fullName: sender.fullName, mail: sender.mail}
            : {id: mail.from, fullName: "Unknown", mail: ""};
        // replace the 'sentTo' attributes
        const recipients = (mail.sentTo || []).map(rid => {
            const ru = getUserById(rid);
            return ru
                ? {id: ru.id, fullName: ru.fullName, mail: ru.mail}
                : {id: rid, fullName: "Unknown", mail: ""};
        })

        return {
            id: mail.id,
            owner: mail.owner,
            from: fromObj,
            sentTo: recipients,
            subject: mail.subject,
            body: mail.body,
            createdAt: mail.createdAt,
            sentAt: mail.sentAt || "",
            labels: mail.labels || [],
            isRead: mail.isRead,
            isStarred: mail.isStarred,
            isTrashed: mail.isTrashed,
        }
    });
}

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

module.exports = {inboxFilters, replaceToUsers, extractUrls};