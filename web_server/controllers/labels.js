const Labels = require('../models/labels');

/**
 * GET /api/labels
 * Return all labels (flat list), including sublabels, for the authenticated user.
 * Responds: [{ id, name, parent }]
 */
exports.getAllLabels = (req, res) => {
    const all = Labels.getAllLabels();
    // Only send fields required by frontend; "parent" is id of parent label (or null for root)
    res.status(200).json(all.map(l => ({
        id: l.id,
        name: l.name,
        parent: l.parent
    })));
};

/**
 * POST /api/labels
 * Create a new root-level label for the user.
 * Request body: { name }
 * Responds: created label object, 201 status.
 */
exports.createNewLabel = (req, res) => {
    const userId = +req.user.id; // User ID from authentication middleware
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const lab = Labels.createNewLabel(userId, name);
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * POST /api/labels/:id/sublabel
 * Create a new sublabel under a parent label (parent ID in URL).
 * Request body: { name }
 * Responds: created sublabel object, or 404 if parent not found.
 */
exports.createSublabel = (req, res) => {
    const userId = +req.user.id;
    const parentId = +req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    // Model should handle parent existence/ownership
    const lab = Labels.createSublabel(userId, parentId, name);
    if (!lab) return res.status(404).json({ error: 'Parent not found' });
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * PATCH /api/labels/:id
 * Rename an existing label by ID.
 * Request body: { name }
 * Responds: 204 on success, 404 if not found.
 */
exports.editLabel = (req, res) => {
    const id = +req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const ok = Labels.editLabelById(id, name);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
};

/**
 * DELETE /api/labels/:id
 * Delete label (and, usually, its sublabels) by ID.
 * Responds: 204 on success, 404 if not found.
 */
exports.deleteLabel = (req, res) => {
    const id = +req.params.id;
    if (!Labels.deleteLabelById(id))
        return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
};
