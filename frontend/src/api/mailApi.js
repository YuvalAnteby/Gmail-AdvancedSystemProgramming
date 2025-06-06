// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/mails
 * Must include the 'user-id' header for auth.
 * @returns an array of mail objects (up to 50) for both sent & received (non-deleted).
 */
export async function getMails(userId) {
    const res = await fetch(`${API_BASE}/mails`, {
        method: "GET",
        headers: {
            "user-id": userId,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error(`getMails failed: ${res.status}`);
    }
    return await res.json(); // array of mail objects
}