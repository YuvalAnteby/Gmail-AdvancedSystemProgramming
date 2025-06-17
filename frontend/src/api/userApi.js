const API_BASE = "http://localhost:3001/api";

/**
 * GET /api/users/search?email=...
 * @param {string} query 
 * @returns {Promise<Array<{ id: number, fullName: string, mail: string }>>}
 */
export async function searchUsersByEmail(query) {
    const res = await fetch(`${API_BASE}/users/search?email=${encodeURIComponent(query)}`);
    if (!res.ok)
        throw new Error("Failed to search users");
    return res.json();
}