// frontend/src/utils/files.js

/**
 * Convert any File into a Base64 data URL.
 * @param {File} file
 * @returns {Promise<string>} e.g. "data:image/png;base64,iVBORw0KG…"
 */
export function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Given a mail object with mail attachments array,
 * return just the original filenames.
 *
 * @param {{attachments?: Array<{originalName?:string,name?:string}>}} mail
 * @returns {string[]}
 */
export function getFilenamesFromMail(mail) {
    if (!mail || !Array.isArray(mail.attachments)) return [];
    return mail.attachments.map(att => att.originalName || att.name);
}
