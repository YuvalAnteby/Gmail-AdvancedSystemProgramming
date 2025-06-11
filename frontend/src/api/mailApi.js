// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/mails
 * Body: { inboxType: string (e.g. "all", "incoming", "sent", "draft", "star", "trash") }
 * Must include the 'user-id' header for auth.
 *
 * @param {number|string} userId
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} [inboxType]
 * @returns Promise<array of mail objects> (up to 50).
 */
export async function getMailsByType(userId, inboxType = "all") {
    // change the URL to include the optional query param
    let url = `${API_BASE}/mails`;
    // encode just in case but these are simple words
    if (inboxType)
        url += `?inboxType=${encodeURIComponent(inboxType)}`;
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
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function deleteMail(userId, mailId) {
    const url = `${API_BASE}/mails/${mailId}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        }
    })
    if (!res.ok)
        throw new Error(`getMails failed: ${res.status}`);
    console.log(`deletion: ${res.status}`);
}

/**
 * POST api/blacklist
 * @param {number|string} userId
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function reportSpam(userId, mailId) {
    const url = `${API_BASE}/blacklist`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mailId: mailId
        })
    })
    if (!res.ok)
        throw new Error(`reporting spam failed: ${res.status}`);
    console.log(`marking spam: ${res.status}`);
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
    console.log(`marking read: ${res.status}`);

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