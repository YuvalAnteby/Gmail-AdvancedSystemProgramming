const Labels = require('../models/labels');

// GET /api/labels
const getAllLabels = (req, res) => {
    const rawLabels = Labels.getAllLabels();
    const cleanLabels = rawLabels.map(label => ({
        id: label.id,
        name: label.name
    }));
    res.status(200).send(JSON.stringify(cleanLabels, null, 2));
};

// POST /api/labels
const createNewLabel = (req, res) => {
    const userId = parseInt(req.headers['userid']);
    const labelName = req.body.name;

    if (!labelName) {
        return res.status(400).send(JSON.stringify({ error: 'Name is required' }, null, 2));
    }

    const newLabel = Labels.createNewLabel(userId, labelName);
    if (!newLabel) {
        return res.status(400).send(JSON.stringify({ error: 'Failed to create label' }, null, 2));
    }

    res.status(201)
        .location(`/api/labels/${newLabel.id}`)
        .send(JSON.stringify({ id: newLabel.id, name: newLabel.name }, null, 2));
};

// GET /api/labels/:id
const getLabelById = (req, res) => {
    const id = parseInt(req.params.id);
    const label = Labels.getLabelById(id);
    if (!label) {
        return res.status(404).send(JSON.stringify({ error: "Label not found" }, null, 2));
    }

    res.status(200).send(JSON.stringify({ id: label.id, name: label.name }, null, 2));
};

// PATCH /api/labels/:id
const editLabel = (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const updated = Labels.editLabel(id, name);
    if (!updated) {
        return res.status(404).end();
    }
    res.status(200).send(JSON.stringify({ id: updated.id, name: updated.name }, null, 2));
};

const deleteLabel = (req, res) => {
    const id = parseInt(req.params.id);
    const success = Labels.deleteLabel(id);
    if (!success) {
        return res.status(404).end();
    }
    res.status(204).end();
};

module.exports = {
    getAllLabels,
    createNewLabel,
    getLabelById,
    editLabel,
    deleteLabel
};