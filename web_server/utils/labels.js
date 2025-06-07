const Labels = require("../models/Labels");

/**
 * Converts an array of label names to their ids
 * @param userId owner of the label
 * @param labelsByNames array of labels' names
 * @returns {number[]} array of labels ids
 */
function convertLabelsToIds(userId, labelsByNames) {
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

module.exports = {convertLabelsToIds, labelsToFullElement}