// Base URL — adjust port if needed
import {MAILS_PER_PAGE} from "../utils/constants";

const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/mails/:id
 * @param {number} emailId id of a mail to fetch
 * @returns {Promise<any>}
 */
export async function fetchEmail(emailId) {
    const url = `${API_BASE}/mails/${emailId}`;
    const token = localStorage.getItem('token');

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
 * GET /api/mails
 * params: { inboxType: string (e.g. "all", "incoming", "sent", "draft", "star", "trash") }
 * Must include the 'user-id' header for auth.
 *
 * @param {'all'|'incoming'|'sent'|'draft'|'star'|'trash'} [inboxType]
 * @param {number} page
 * @returns Promise<array of mail objects> (up to 50).
 */
export async function getMailsByType(inboxType = "all", page = 1) {
    // change the URL to include the optional query param
    let url = `${API_BASE}/mails?inboxType=${encodeURIComponent(inboxType)}&page=${page}&limit=${MAILS_PER_PAGE}`;
    const token = localStorage.getItem('token');

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
 * @param {Object} mail
 * @returns {Promise<void>}
 */
export async function deleteMail(mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
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
 * @param {Object} mail
 * @returns {Promise<void>}
 */
export async function toggleSpamReport(mail) {
    const url = `${API_BASE}/blacklist/`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: mail.isSpam ? 'DELETE' : 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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

/**
 * PATCH api/mails/:id
 * @param {Object} mail mail object to toggle it's star
 * @returns {Promise<void>}
 */
export async function toggleMailStar(mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
    const token = localStorage.getItem('token');
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isStarred: !mail.isStarred,
        })
    })
    if (!res.ok)
        throw new Error(`toggleStarred failed ${res.status}`);
    return res.json();
}

/**
 * PATCH api/mails/:id
 * @param mail mail object to restore from trash
 * @returns {Promise<void>}
 */
export async function restoreMail(mail) {
    const url = `${API_BASE}/mails/${mail.id}`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
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
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok)
        throw new Error(`Search failed ${res.status}`);
    return res.json();
};

/**
 * POST /api/mails
 * @param {{ subject: string, body: string, sentTo: string[] }} mailData
 */
export async function sendMail({ subject, body, sentTo }) {
    const url   = `${API_BASE}/mails`;
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
        method:  "POST",
        headers: {
            "Authorization":  `Bearer ${token}`,
            "Content-Type":   "application/json",
        },
        body: JSON.stringify({ subject, body, sentTo })
    });

    if (!res.ok) throw new Error(`sendMail failed: ${res.status}`);
    return await res.json();
}
