// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/mails
 * Body: { inboxType: string (e.g. "all", "incoming", "sent", "draft", "star", "trash") }
 *
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} [inboxType]
 * @returns Promise<array of mail objects> (up to 50).
 */
export async function getMailsByType(inboxType = "all") {
    // change the URL to include the optional query param
    let url = `${API_BASE}/mails`;
    const token = localStorage.getItem('token');
    // encode just in case but these are simple words
    if (inboxType)
        url += `?inboxType=${encodeURIComponent(inboxType)}`;
    // Perform GET with the JWT token in the header
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!res.ok)
        throw new Error(`getMails failed: ${res.status}`);
    return await res.json();
}

/**
 * DELETE api/mails/:id
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function deleteMail(mailId) {
    const url = `${API_BASE}/mails/${mailId}`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (!res.ok)
        throw new Error(`getMails failed: ${res.status}`);
}

/**
 * POST api/blacklist
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function reportSpam(mailId) {
    const url = `${API_BASE}/blacklist`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mailId: mailId
        })
    })
    if (!res.ok)
        throw new Error(`reporting spam failed: ${res.status}`);
}

/**
 * PATCH api/mails/:id
 * @param {number|string} mailId
 * @returns {Promise<void>}
 */
export async function markAsRead(mailId) {
    const url = `${API_BASE}/mails/${mailId}`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isRead: true,
        })
    })
    if (!res.ok)
        throw new Error(`marking read failed: ${res.status}`);
}