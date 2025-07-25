/**
 * Converts timestamp to YYYY/MM/DD for showing information
 * @param iso timestamp as ISO string
 * @returns {string} date in format YYYY/MM/DD
 */
export const formatDate = (iso) =>
    new Date(iso).toISOString().split('T')[0].replace(/-/g, '/');

/**
 * Converts timestamp to full time string for showing exact time in the format MONTH DD, YYYY at HH:MM
 * @param iso timestamp as ISO string
 * @returns {string} date in format `MONTH DD, YYYY at HH:MM`
 */
export const formatFullTime = (iso) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
    }).format(date);
};