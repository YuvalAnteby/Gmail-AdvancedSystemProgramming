// Initial example labels
let labels = [
    { id: 1, name: 'work',    owner: 1, parent: null },
    { id: 2, name: 'friends', owner: 1, parent: null },
];

// Simple incrementing ID
let nextId = labels.length + 1;

/**
 * Get all labels (no user filter; in a real app, should filter by user)
 * @returns {Array} All label objects
 */
function getAllLabels() {
    return labels;
}

/**
 * Find a label by its ID
 * @param {number} id
 * @returns {object|null} Label object or null if not found
 */
function getLabelById(id) {
    return labels.find(l => l.id === id);
}

/**
 * Create a new top-level label (parent is null)
 * @param {number} owner - User ID
 * @param {string} name  - Label name
 * @returns {object} The created label
 */
function createNewLabel(owner, name) {
    const lab = { id: nextId++, owner, name, parent: null };
    labels.push(lab);
    return lab;
}

/**
 * Create a sublabel under an existing label
 * @param {number} owner    - User ID
 * @param {number} parent   - Parent label ID
 * @param {string} name     - Sublabel name
 * @returns {object|null} New label, or null if parent not found
 */
function createSublabel(owner, parent, name) {
    // Check parent exists (could also check ownership)
    if (!labels.find(l => l.id === parent)) return null;
    const newLabel = {
        id: nextId++,     // Use global nextId for unique ID
        name,
        owner,
        parent,           // Link to parent label by id
    };
    labels.push(newLabel);
    return newLabel;
}

/**
 * Rename a label by ID
 * @param {number} id
 * @param {string} name
 * @returns {object|null} Updated label or null if not found
 */
function editLabelById(id, name) {
    const lab = getLabelById(id);
    if (!lab) return null;
    lab.name = name;
    return lab;
}

/**
 * Delete a label by ID (does not cascade to sublabels)
 * @param {number} id
 * @returns {boolean} True if deleted, false if not found
 */
function deleteLabelById(id) {
    const idx = labels.findIndex(l => l.id === id);
    if (idx < 0) return false;
    labels.splice(idx, 1);
    return true;
}

// Export all functions
module.exports = {
    getAllLabels,
    getLabelById,
    createNewLabel,
    createSublabel,
    editLabelById,
    deleteLabelById
};
