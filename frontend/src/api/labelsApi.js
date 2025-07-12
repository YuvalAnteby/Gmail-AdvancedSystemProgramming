// src/api/labelsApi.js

// Base URL — adjust port/host if needed
const API_BASE = "http://localhost:3001/api";
const ROOT     = `${API_BASE}/labels`;

/**
 * Fetch all labels
 * @returns {Promise<Array<{id:number,name:string,parent?:number}>>}
 */
export async function fetchLabels() {
    const token = localStorage.getItem("token");
    const res = await fetch(ROOT, {
        method:  "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(`fetchLabels failed: ${res.status}`);
    return res.json();
}

/**
 * Create a new label
 * @param {string} name
 */
export async function createLabel(name) {
    const token = localStorage.getItem("token");
    const res = await fetch(ROOT, {
        method:  "POST",
        headers: {
            "Authorization":  `Bearer ${token}`,
            "Content-Type":   "application/json"
        },
        body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error(`createLabel failed: ${res.status}`);
}

/**
 * Rename an existing label
 * @param {number} id
 * @param {string} newName
 */
export async function editLabel(id, newName) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${ROOT}/${id}`, {
        method:  "PATCH",
        headers: {
            "Authorization":  `Bearer ${token}`,
            "Content-Type":   "application/json"
        },
        body: JSON.stringify({ name: newName })
    });
    if (!res.ok) throw new Error(`editLabel failed: ${res.status}`);
}

/**
 * Delete a label
 * @param {number} id
 */
export async function deleteLabel(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${ROOT}/${id}`, {
        method:  "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(`deleteLabel failed: ${res.status}`);
}

/**
 * Create a sublabel under a parent label
 * @param {number} parentId
 * @param {string} name
 */
export async function createLabelUnderParent(parentId, name) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${ROOT}/${parentId}/sublabel`, {
        method:  "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type":  "application/json"
        },
        body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error(`createLabelUnderParent failed: ${res.status}`);
    return res.json();
}