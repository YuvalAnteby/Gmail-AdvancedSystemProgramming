/**
 * Converts a file to base64 encoded string in order to upload and store in the backend.
 * @param {File} file file to convert
 * @returns {Promise<string>} Base64-encoded data URL (e.g. `"data:image/jpeg;base64,..."`)
 */
export function convertToBase64 (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // this is the base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function getFileNamesFromMail(mail) {
    if (!mail || !Array.isArray(mail.files)) {
        return [];
    }
    return mail.files.map(file => file.name);
}
