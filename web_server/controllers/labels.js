const Labels = require('../models/labels');


const getAllLabels = (req, res) => {
    return res.status(200).json(Labels.getAllLabels());
};
const createNewLabel = (req, res) => {
    const userId = parseInt(req.headers('userId'));
    if (isNaN(userId)) {
        return res.status(400).json({error: 'User not authenticated'});
    }
    const labalName = req.body.name;
    if (!(labalName)) {
        return res.status(400).json({error: 'Name is required'})
    }
    // Create the new label (should return the object with .id)
    const newLabel = Labels.createNewLabel(userId, labelName);
    if (!newLabel) {
        // Shouldn't happen, but just in case
        return res.status(400).json({ error: 'Failed to create label' });
    }

    // Respond with 201 Created, Location header
    res.status(201)
        .location(`/api/labels/${newLabel.id}`)
        .end
};

module.exports = {getAllLabels, createNewLabel}