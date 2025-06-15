const Labels = require("../models/labels");

/**
 * Converts an array of label names to their ids
 * @param userId owner of the label
 * @param labelsByNames array of labels' names
 * @returns {number[]} array of labels ids
 */
function convertLabelsToIds(userId, labelsByNames) {
    if (!labelsByNames)
        return [];
    return labelsByNames.map(label => {
        return Labels.getLabelByName(userId, label).id;
    })
}

/**
 * Converts an array of label ids to include the entire object
 * @param userId owner of the label
 * @param labelsIds array of labels' ids
 * @returns {*} array of labels elements
 */
function labelsToFullElement(userId, labelsIds) {
    return labelsIds.map(label => {
        return Labels.getLabelById(userId, label);
    })
}

/**
 * @param {number} userId owner of the label
 * @param {Object} mail mail object
 * @returns {string[]} an array of lowercase label names for this mail.
 */
const mailLabelNames = (userId, mail) => {
    return (mail.labels || [])
        .map(labelId => Labels.getLabelById(userId, labelId).name)
        .filter(Boolean)
        .map(name => name.toLowerCase());
};

module.exports = {convertLabelsToIds, labelsToFullElement, mailLabelNames}