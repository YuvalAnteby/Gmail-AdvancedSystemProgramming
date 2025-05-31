/**
 * label object structure:
 *  id - positive number now
 *  owner - user id of the label's owner
 *  name - label's name
 */
const labels = [];
let labelId = 0;

/**
 * Returns all labels saved
 * @returns {*[]}
 */
const getAllLabels = () => labels

/**
 * Creates a new label
 * @param owner user id of the label's owner
 * @param name name of the label
 * @returns {{id: number, name, owner}|null} null if input is invalid, otherwise the label object
 */
const createNewLabel = (owner, name) => {
    if (!name)
        return null;
    const newLabel = {
        id: ++labelId,
        name: name,
        owner: owner,
    }
    labels.push(newLabel);
    return newLabel;
}

/**
 *
 * @param id id of a label
 * @returns {*} label object with the same id
 */
const getLabelById = (id) => labels.find(label => label.id === id);

/**
 * Edits the label with new info
 * @param labelId id of a label to edit
 * @param name new name of the label
 * @returns {*|null} if invalid or not found null, otherwise the updated label object
 */
const editLabel = (labelId, name) => {
 //   if (!labelId || !name)
 //       return null;
    // search the label with the index
    const index = labels.findIndex(label => label.id === labelId);
    if (index === -1)
        return null;
    labels[index].name = name;
    return labels[index];
}

/**
 * Deletes a label by id
 * @param labelId id of a label to delete
 * @returns {boolean} true if deleted, otherwise false
 */
const deleteLabel = (labelId) => {
    const index = labels.findIndex(label => label.id === labelId);
    if (index === -1)
        return false;
    labels.splice(index, 1);
    return true;
}

module.exports = {getAllLabels, createNewLabel, getLabelById, editLabel, deleteLabel}