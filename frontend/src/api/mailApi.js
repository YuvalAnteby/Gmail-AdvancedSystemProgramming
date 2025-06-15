// Base URL — adjust port if needed
import {MAILS_PER_PAGE} from "../utils/constants";

const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/mails
 * params: { inboxType: string (e.g. "all", "incoming", "sent", "draft", "star", "trash") }
 * Must include the 'user-id' header for auth.
 *
 * @param {number|string} userId
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} [inboxType]
 * @param {number} page
 * @returns Promise<array of mail objects> (up to 50).
 */
export async function getMailsByType(userId, inboxType = "all", page = 1) {
    // change the URL to include the optional query param
    let url = `${API_BASE}/mails?inboxType=${encodeURIComponent(inboxType)}&page=${page}&limit=${MAILS_PER_PAGE}`;
    // Perform GET with user-id header
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok)
        throw new Error(`getMails failed: ${res.status}`);
    return await res.json();
}

/**
 * DELETE api/mails/:id
 * @param {number|string} userId
 * @param {Object} mail
 * @returns {Promise<void>}
 */
export async function deleteMail(userId, mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        }
    })
    if (!res.ok)
        throw new Error(`getMails failed: ${res.status}`);
}

/**
 * POST api/blacklist
 * @param {number|string} userId
 * @param {Object} mail
 * @returns {Promise<void>}
 */
export async function toggleSpamReport(userId, mail) {
    const url = `${API_BASE}/blacklist`;
    const res = await fetch(url, {
        method: mail.isSpam ? 'DELETE' : 'POST',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mailId: mail.id
        })
    })
    if (!res.ok)
        throw new Error(`reporting spam failed: ${res.status}`);
}

/**
 * PATCH api/mails/:id
 * @param {number|string} userId
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function markAsRead(userId, mailId) {
    const url = `${API_BASE}/mails/${mailId}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isRead: true,
        })
    })
    if (!res.ok)
        throw new Error(`marking read failed: ${res.status}`);
}

/**
 * PATCH api/mails/:id
 * @param {number|string} userId
 * @param {Object} mail mail object to toggle it's star
 * @returns {Promise<void>}
 */
export async function toggleMailStar(userId, mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isStarred: !mail.isStarred,
        })
    })
    if (!res.ok)
        throw new Error(`toggleStarred failed ${res.status}`);
    return res.json();
}


export async function restoreMail(userId, mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isTrashed: false,
        })
    })
    if (!res.ok)
        throw new Error(`restore mail: ${res.status}`);
}
/**
 * GET api/mails/:query
 * @param userId {number|string} user id that makes the search
 * @param {string} query to search in mails
 * @returns {Promise<any>}
 */
export const searchMails = async (userId, query) => {
    const url = `${API_BASE}/mails/search/${encodeURIComponent(query)}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'user-id': userId,
        }
    });
    if (!res.ok)
        throw new Error(`Search failed ${res.status}`);
    return res.json();
};