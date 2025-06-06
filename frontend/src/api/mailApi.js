// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

/**
 * POST /api/mails
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