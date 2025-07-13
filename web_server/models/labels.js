// Initial example labels
let labels = [ { id: 1, name: 'work',    owner: 1, parent: null },
    { id: 2, name: 'friends', owner: 1, parent: null },];

// Simple incrementing ID
let nextId = labels.length + 1;

/**
 * Return all labels owned by a specific user.
 * @param {number} userId - ID of the user requesting the labels
 * @returns {Array} Filtered label objects owned by the user
 */
function getAllLabels(userId) {
    return labels.filter(l => l.owner === userId);
}

/**
 * Find a label by its ID and owner
 * @param {number} id - ID of label
 * @param {number} owner - ID of the user
 * @returns {object|null} Label object or null if not found
 */
function getLabelById(id,owner) {
    return labels.find(l => l.id === id && l.owner === owner) || null;
}

/**
 * Create a new top-level label (parent is null)
 * @param {number} owner - User ID
 * @param {string} name  - Label name
 * @returns {object} The created label
 */
function createNewLabel(owner, name) {
    if (isDuplicateLabel(owner, name, null)) return null;
    const lab = { id: nextId++, owner, name, parent: null };
    labels.push(lab);
    return lab;
}

/**
 * Check if a label with the same name already exists
 * for a given user and (optional) parent.
 * Used to prevent duplicates on create/edit.
 * @param {number} owner - User ID
 * @param {string} name - Label name to check
 * @param {number|null} parent - Parent label ID or null
 * @param {number|null} excludeId - Optional: label ID to exclude from check (for editing)
 * @returns {boolean} True if duplicate exists, false otherwise
 */
function isDuplicateLabel(owner, name, parent = null, excludeId = null) {
    return labels.some(l =>
        l.owner === owner &&
        l.name === name &&
        l.parent === parent &&
        (excludeId === null || l.id !== excludeId)
    );
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
    const parentLabel = getLabelById(parent, owner);
    if (!parentLabel) return null;

    // Prevent duplicate sublabel names under the same parent for the same user
    if (isDuplicateLabel(owner, name, parent)) return null;

    const newLabel = {
        id: nextId++,
        name,
        owner,
        parent,
    };
    labels.push(newLabel);
    return newLabel;
}

/**
 * Rename a label by ID
 * @param {number} id
 * @param {string} newName
 * @param {number} owner - User ID
 * @returns {object|null} Updated label or null if not found
 */
function editLabelById(id, owner,newName) {
    // Check parent exists (could also check ownership)
    const Label = getLabelById(id, owner);
    if (!Label) return null;
    // Check if another label with the same name already exists
    if (isDuplicateLabel(owner, newName, Label.parent, id)) {
            throw new Error("409");
        }
    // Rename the label
    Label.name = newName;
    return Label;
}

/**
 * Delete a label by ID (does not cascade to sublabels)
 * @param {number} id
 * @param {number} owner - User ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteLabelById(id,owner) {
    const idx = getLabelById(id, owner);
    if (!idx) return false;
    // Recursively delete children
    const childLabels = labels.filter(l => l.parent === id && l.owner === owner);
    childLabels.forEach(child => {
        deleteLabelById(child.id, owner);
    });

    // Delete the label itself
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