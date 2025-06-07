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

module.exports = {convertLabelsToIds}