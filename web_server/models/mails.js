const Mail = require('../db/models/Mail');
const Counter = require('../db/models/Counter');

async function nextSequence(sequenceName) {
    const updated = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return updated.seq;
}

function buildInboxMatch(owner, inboxType) {
    const base = { owner };
    switch ((inboxType || 'all').toLowerCase()) {
        // drafts aliases
        case 'draft':
        case 'drafts':
            return { ...base, isDraft: true };
        case 'trash':
            return { ...base, isTrashed: true };
        case 'spam':
            return { ...base, isSpam: true };
        // starred aliases
        case 'star':
        case 'starred':
            return { ...base, isStarred: true, isDraft: { $ne: true } };
        case 'sent':
            return { ...base, from: owner, isDraft: { $ne: true } };
        // inbox aliases
        case 'incoming':
        case 'inbox':
            return { ...base, isDraft: { $ne: true }, isTrashed: { $ne: true }, isSpam: { $ne: true }, from: { $eq: owner } };
        case 'all':
        default:
            return { ...base, isDraft: { $ne: true } };
    }
}

async function getUserMails(userId, limit, inboxType, page) {
    const match = buildInboxMatch(userId, inboxType);
    const total = await Mail.countDocuments(match);
    const paged = await Mail.find(match)
        .sort({ createdAt: -1 })
        .skip(((page || 1) - 1) * (limit || 50))
        .limit(limit || 50)
        .lean();
    return { paged, total };
}

async function saveDraft(owner, subject, body, sentToIds, files) {
    const id = await nextSequence('mails');
    const created = await Mail.create({
        id,
        owner,
        from: owner,
        sentTo: sentToIds || [],
        subject: subject || '',
        body: body || '',
        isDraft: true,
        files: files || [],
        labels: [],
    });
    return created.toObject();
}

async function sendNewMail(owner, subject, body, sentToIds, files) {
    // create owner's copy (sent)
    const ownerId = await nextSequence('mails');
    const ownerMail = await Mail.create({
        id: ownerId,
        owner,
        from: owner,
        sentTo: sentToIds || [],
        subject: subject || '',
        body: body || '',
        isDraft: false,
        files: files || [],
        labels: [],
    });

    // create recipient copies
    if (Array.isArray(sentToIds)) {
        for (const recipient of sentToIds) {
            if (Number(recipient) === Number(owner)) continue;
            const rid = await nextSequence('mails');
            // eslint-disable-next-line no-await-in-loop
            await Mail.create({
                id: rid,
                owner: recipient,
                from: owner,
                sentTo: sentToIds || [],
                subject: subject || '',
                body: body || '',
                isDraft: false,
                files: files || [],
                labels: [],
            });
        }
    }

    return ownerMail.toObject();
}

async function getMail(id) {
    return Mail.findOne({ id }).lean();
}

async function editSentMail(mailId, isRead, isStarred, isTrashed, isSpam, labelsIds) {
    const mail = await Mail.findOne({ id: mailId });
    if (!mail) return 404;
    if (typeof isRead === 'boolean') mail.isRead = isRead;
    if (typeof isStarred === 'boolean') mail.isStarred = isStarred;
    if (typeof isTrashed === 'boolean') mail.isTrashed = isTrashed;
    if (typeof isSpam === 'boolean') mail.isSpam = isSpam;
    if (Array.isArray(labelsIds)) mail.labels = labelsIds;
    await mail.save();
    return mail.toObject();
}

async function updateDraft(mailId, subject, body, sentToIds, files) {
    const mail = await Mail.findOne({ id: mailId, isDraft: true });
    if (!mail) return 404;
    if (typeof subject === 'string') mail.subject = subject;
    if (typeof body === 'string') mail.body = body;
    if (Array.isArray(sentToIds)) mail.sentTo = sentToIds;
    if (Array.isArray(files)) mail.files = files;
    await mail.save();
    return mail.toObject();
}

async function deleteMail(owner, mailId) {
    const mail = await Mail.findOne({ id: mailId });
    if (!mail) return 404;
    if (Number(mail.owner) !== Number(owner)) return 400;
    await Mail.deleteOne({ id: mailId });
    return true;
}

async function searchInInbox(query, owner) {
    const q = (query || '').trim();
    if (!q) return [];
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return Mail.find({
        owner,
        isDraft: { $ne: true },
        $or: [
            { subject: regex },
            { body: regex },
        ],
    })
        .sort({ createdAt: -1 })
        .lean();
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
