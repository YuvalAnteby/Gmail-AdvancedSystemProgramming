const Labels = require('../models/labels');

/**
 * GET /api/labels
 * Return all labels (flat list),  belonging only to the authenticated user.
 * Responds: [{ id, name, parent }]
 */
exports.getAllLabels = async (req, res) => {
    const userId = +req.user.id;
    const all = await Labels.getAllLabels(userId);
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
exports.createNewLabel = async (req, res) => {
    // User ID from authentication middleware
    const userId = +req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const lab = await Labels.createNewLabel(userId, name);
    if (!lab) return res.status(409).json({ error: 'Label name already exists' });
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * POST /api/labels/:id/sublabel
 * Create a new sublabel under a parent label (parent ID in URL).
 * Request body: { name }
 * Responds: created sublabel object, or 404 if parent not found.
 */
exports.createSublabel = async (req, res) => {
    const userId = +req.user.id;
    const parentId = +req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    // Model should handle parent existence/ownership
    const lab = await Labels.createSublabel(userId, parentId, name);
    if (!lab) return res.status(404).json({ error: 'Parent not found' });
    else if (!lab) return res.status(409).json({ error: 'Label name already exists' });
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * PATCH /api/labels/:id
 * Rename an existing label by ID.
 * Request body: { name }
 * Responds: 204 on success, 404 if not found.
 */
exports.editLabel = async (req, res) => {
    const id = +req.params.id;
    const userId = +req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    try {
        const ok = await Labels.editLabelById(id, userId, name);
        if (!ok) return res.status(404).json({ error: 'Not found' });
        res.status(204).end();
    } catch (e) {
        if (String(e && e.message) === '409') return res.status(409).json({ error: 'Label name already exists' });
        return res.status(500).json({ error: 'Internal error' });
    }
};

/**
 * DELETE /api/labels/:id
 * Delete label (and, usually, its sublabels) by ID.
 * Responds: 204 on success, 404 if not found.
 */
exports.deleteLabel = async (req, res) => {
    const labelId = +req.params.id;
    const userId = +req.user.id;

    if (!(labelId))
        return res.status(400).json({ error: 'Invalid label ID' });

    const deleted = await Labels.deleteLabelById(labelId, userId);
    if (!deleted)
        return res.status(404).json({ error: 'Label not found or not owned by user' });

    return res.status(204).end();
}
