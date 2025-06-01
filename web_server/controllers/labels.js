const Labels = require('../models/labels');

/**
 * GET /api/labels
 * @returns a pretty-printed JSON array of all labels with newlines and indentation.
 */
const getAllLabels = (req, res) => {
    const rawLabels = Labels.getAllLabels();
    const cleanLabels = rawLabels.map(label => ({
        id: label.id,
        name: label.name
    }));

    return res
        .status(200)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(JSON.stringify(cleanLabels, null, 2));
};

/**
 * POST /api/labels
 * Creates a new label. Expects a numeric “userid” header and a JSON
 * @returns 201 Created with Location header only
 * Errors:
 *   - 400 Bad Request if name is missing
 *   - 400 Bad Request if creation fails
 */
const createNewLabel = (req, res) => {
    const userId = Number(req.headers['user-id']);
    const labelName = req.body.name;

    if (!labelName) {
        return res
            .status(400)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Name is required' },
                null,
                2
            ));
    }

    const newLabel = Labels.createNewLabel(userId, labelName);
    if (!newLabel) {
        return res
            .status(400)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Failed to create label' },
                null,
                2
            ));
    }

    return res
        .status(201)
        .location(`/api/labels/${newLabel.id}`)
        .end();
};

/**
 * GET /api/labels/:id
 * @returns the label object { id, name } pretty-printed, or 404 if not found.
 */
const getLabelById = (req, res) => {
    const id = Number(req.headers['user-id']);
    const label = Labels.getLabelById(id);

    if (!label) {
        return res
            .status(404)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Label not found' },
                null,
                2
            ));
    }

    return res
        .status(200)
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(JSON.stringify(
            { id: label.id, name: label.name },
            null,
            2
        ));
};

/**
 * PATCH /api/labels/:id
 * Updates the name of an existing label. Expects JSON body { "name": "<newName>" }.
 * @returns 204 No Content on success.
 * Errors:
 *   - 400 Bad Request if name is missing
 *   - 404 Not Found if label does not exist
 */
const editLabel = (req, res) => {
    const id = Number(req.headers['user-id']);
    const name = req.body.name;

    if (!name) {
        return res
            .status(400)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Name is required to update' },
                null,
                2
            ));
    }

    const updated = Labels.editLabel(id, name);
    if (!updated) {
        return res
            .status(404)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Label not found' },
                null,
                2
            ));
    }

    return res.status(204).end();
};

/**
 * DELETE /api/labels/:id
 * Deletes an existing label by ID.
 * @returns 204 No Content on success.
 * Errors:
 *   - 404 Not Found if label does not exist
 */
const deleteLabel = (req, res) => {
    const id = Number(req.headers['user-id']);
    const success = Labels.deleteLabel(id);

    if (!success) {
        return res
            .status(404)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(JSON.stringify(
                { error: 'Label not found' },
                null,
                2
            ));
    }

    return res.status(204).end();
};

module.exports = {
    getAllLabels,
    createNewLabel,
    getLabelById,
    editLabel,
    deleteLabel
};
