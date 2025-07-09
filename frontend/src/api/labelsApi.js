// src/api/labelsApi.js

import { applyLabelsToMail, getMailsByLabel } from "./mailApi";

const API_BASE = "http://localhost:3001/api";
const ROOT     = `${API_BASE}/labels`;

/**
 * Fetch all labels for current user
 * @returns {Promise<Array<{id:number,name:string,parent?:number}>>}
 */
export async function fetchLabels() {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");
    const res = await fetch(`${ROOT}?email=${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(`fetchLabels failed: ${res.status}`);
    return res.json();
}

/**
 * Create a new label, prevent duplicates (client-side check)
 * @param {string} name
 */
export async function createLabel(name) {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    const nameNormalized = name.trim().toLowerCase();

    // Fetch current user's labels
    const existingLabels = await fetchLabels();
    const isDuplicate = existingLabels.some(
        label => label.name.trim().toLowerCase() === nameNormalized
    );

    if (isDuplicate) {
        alert(`A label named "${name}" already exists.`);
        return;
    }

    // Send request to server
    const res = await fetch(ROOT, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email: userEmail })
    });

    if (!res.ok) throw new Error(`createLabel failed: ${res.status}`);
}


/**
 * Rename a label
 * @param {number} id
 * @param {string} newName
 */
export async function editLabel(id, newName) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${ROOT}/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newName })
    });
    if (!res.ok) throw new Error(`editLabel failed: ${res.status}`);
}

/**
 * Delete label and remove it from all mails for this user
 * @param {number} id
 */
export async function deleteLabel(id) {
    const token = localStorage.getItem("token");

    try {
        // Step 1: get only current user's mails that use this label
        const { mails } = await getMailsByLabel(id);

        // Step 2: remove the label from each mail
        for (const mail of mails) {
            const newLabels = (mail.labels || []).filter(
                label => label && label.id !== id && label !== id
            );
            await applyLabelsToMail(mail.id, newLabels);
        }
    } catch (e) {
        console.warn("Label cleanup failed", e);
    }

    // Step 3: remove label from database
    const res = await fetch(`${ROOT}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error(`deleteLabel failed: ${res.status}`);
}

/**
 * Create a sublabel (child label) under a parent label
 * @param {number} parentId
 * @param {string} name
 */
export async function createLabelUnderParent(parentId, name) {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    const res = await fetch(`${ROOT}/${parentId}/sublabel`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email: userEmail })
    });

    if (!res.ok) throw new Error(`createLabelUnderParent failed: ${res.status}`);
    return res.json();
}
