const Labels = require('../models/labels');

/**
 * GET /api/labels
 * Return all labels for the current user only
 */
exports.getAllLabels = (req, res) => {
    const userId = +req.user.id;
    const userLabels = Labels.getAllLabels().filter(l => l.owner === userId);

    res.status(200).json(userLabels.map(l => ({
        id: l.id,
        name: l.name,
        parent: l.parent
    })));
};

/**
 * POST /api/labels
 * Create a new label for the current user
 */
exports.createNewLabel = (req, res) => {
    const userId = +req.user.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Name required' });

    // Check for duplicate name
    const existing = Labels.getAllLabels().find(
        l => l.owner === userId && l.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (existing)
        return res.status(409).json({ error: 'Label name already exists' });

    const lab = Labels.createNewLabel(userId, name);
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * POST /api/labels/:id/sublabel
 * Create a new sublabel under an existing parent label
 */
exports.createSublabel = (req, res) => {
    const userId = +req.user.id;
    const parentId = +req.params.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Name required' });

    const lab = Labels.createSublabel(userId, parentId, name);
    if (!lab) return res.status(404).json({ error: 'Parent label not found or not yours' });

    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

/**
 * PATCH /api/labels/:id
 * Rename an existing label (only if owned by user)
 */
exports.editLabel = (req, res) => {
    const userId = +req.user.id;
    const id = +req.params.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Name required' });

    const label = Labels.getLabelById(id);
    if (!label || label.owner !== userId)
        return res.status(403).json({ error: 'Access denied' });

    label.name = name;
    res.status(204).end();
};

/**
 * DELETE /api/labels/:id
 * Delete a label owned by the current user
 */
exports.deleteLabel = (req, res) => {
    const userId = +req.user.id;
    const id = +req.params.id;

    const label = Labels.getLabelById(id);
    if (!label || label.owner !== userId)
        return res.status(403).json({ error: 'Access denied' });

    Labels.deleteLabelById(id);
    res.status(204).end();
};
