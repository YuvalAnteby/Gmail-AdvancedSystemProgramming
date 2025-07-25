import {convertToBase64} from "../utils/files";

/**
 * File responsible on calls to the web server for profile related information.
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * change the user's profile picture (doesn't save the image, only updates the path)
 * @param userId
 * @param file path to the image
 * @returns {Promise<string>}
 */
export const changeProfileImage = async (userId, file) => {
    const url = `${API_BASE}/users/${userId}`;
    // Convert file to base64
    const base64 = await convertToBase64(file);

    const res = await fetch(url, {
        method: "PATCH",
        headers: {
            "user-id": userId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "image": base64
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