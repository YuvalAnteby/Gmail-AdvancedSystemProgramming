/**
 * Converts timestamp to YYYY/MM/DD for showing information
 * @param iso timestamp as ISO string
 * @returns {string} date in format YYYY/MM/DD
 */
export const formatDate = (iso) =>
    new Date(iso).toISOString().split('T')[0].replace(/-/g, '/');