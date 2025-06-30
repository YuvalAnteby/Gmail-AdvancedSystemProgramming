import {markAsRead} from "../api/mailApi";

/**
 * Marks the given mail as read if it's currently unread.
 * @param {Object} mail mail object
 * @param {Function} onUpdate optional callback (e.g. to refresh view)
 */
export const markMailAsRead = async (mail, onUpdate) => {
    if (mail.isRead)
        return;
    try {
        await markAsRead(mail.id);
        if (typeof onUpdate === 'function') {
            onUpdate(); // Refresh mail list if needed
        }
    } catch (err) {
        console.error("Failed to mark mail as read:", err);
    }
};

/**
 * Removes HTML tags from a text
 * @param html string containing HTML tags
 * @returns {string|string} a string without any HTML tags or code
 */
export const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};