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
 * Convert a File into an attachment descriptor for your mail API:
 *   { name, type, data }
 * where `data` is the raw Base64 (no data:*;base64, prefix).
*
* @param {File} file
* @returns {Promise<{name:string,type:string,data:string}>}
*/
export function convertToBase64Attachment(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const [ , base64 ] = reader.result.split(',');
            resolve({
                name: file.name,
                type: file.type,
                data: base64
            });
        };
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
