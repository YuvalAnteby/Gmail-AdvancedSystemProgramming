// src/utils/htmlUtils.js

/**
 * Ensures that all <a> tags in the HTML open in a new tab with the proper rel attribute for security.
 * @param {string} html - The HTML string to process.
 * @returns {string} - The processed HTML string.
 */
export function addBlankToLinks(html) {
    if (!html) return html;
    // Add target and rel to any <a> without a target, and make sure rel exists if target exists.
    return html
        .replace(/<a\s(?![^>]*target=)[^>]*href=["'][^"']+["'][^>]*>/gi, (aTag) =>
            aTag.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ')
        )
        .replace(/<a\s([^>]*?)target=(["']).*?\2([^>]*)>/gi, (aTag) => {
            // If rel is missing, add it
            if (/rel\s*=/.test(aTag)) return aTag;
            return aTag.replace('>', ' rel="noopener noreferrer">');
        });
}
