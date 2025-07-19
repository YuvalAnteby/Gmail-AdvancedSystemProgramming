const Labels = require("../models/labels");

/**
 * Converts an array of label names to their ids
 * @param {string} userId owner of the label
 * @param {Array} labelsObjects array of labels' objects
 * @returns {number[]} array of labels ids
 */
function convertLabelsToIds(userId, labelsObjects) {
    if (!labelsObjects)
        return [];
    const ids = labelsObjects.map(label => label.id);
    return [...new Set(ids)];
}

/**
 * Converts an array of label ids to include the entire object
 * @param userId owner of the label
 * @param labelsIds array of labels' ids
 * @returns {*} array of labels elements
 */
function labelsToFullElement(userId, labelsIds) {
    if (!labelsIds)
        return [];
    const objects = labelsIds
        .map(id => Labels.getLabelById(id, userId))
        .filter(label => label);
    return [...new Set(objects)];
}

/**
 * @param {number} userId owner of the label
 * @param {Object} mail mail object
 * @returns {string[]} an array of lowercase label names for this mail.
 */
const mailLabelNames = (userId, mail) => {
    return (mail.labels || [])
        .map(labelId => Labels.getLabelById(labelId, userId))
        .filter(label => label && label.name)
        .map(label => label.name.toLowerCase());
};

module.exports = {convertLabelsToIds, labelsToFullElement, mailLabelNames}