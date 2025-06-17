/**
 * File responsible on calls to the web server for profile related information.
 */
// Base URL — adjust port if needed
const API_BASE = "http://localhost:3001/api";

/**
 * change the user's profile picture (doesn't save the image, only updates the path)
 * @param userId
 * @param file path to the image
 * @returns {Promise<string>}
 */
export const changeProfileImage = async (userId, file) => {
    const url = `${API_BASE}/users/${userId}`;
    const objectURL = URL.createObjectURL(file);
    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "user-id": userId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "image": objectURL
        })
    });
    if (!res.ok)
        throw new Error(`changing profile picture: ${res.status}`);
    return res.json();
}

/**
 * fetch user info like name, image path etc
 * @param {number|string} userId id to fetch for
 * @returns {Promise<{fullName: string, imageUrl: string}>}
 */
export const fetchUserInfo = async (userId) => {
    const url = `${API_BASE}/users/${userId}`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    if (!res.ok)
        throw new Error(`error fetching user info: ${res.status}`);
    return res.json();
}