const Labels = require('../models/labels');

exports.getAllLabels = (req,res) => {
    const all = Labels.getAllLabels();
    res.status(200).json(all.map(l=>({
        id:l.id, name:l.name, parent:l.parent
    })));
};

exports.createNewLabel = (req,res) => {
    const userId = +req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error:'Name required' });
    const lab = Labels.createNewLabel(userId, name);
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

exports.createSublabel = (req,res) => {
    const userId   = +req.user.id;
    const parentId = +req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error:'Name required' });
    const lab = Labels.createSublabel(userId, parentId, name);
    if (!lab) return res.status(404).json({ error:'Parent not found' });
    res.status(201).location(`/api/labels/${lab.id}`).json(lab);
};

exports.editLabel = (req,res) => {
    const id   = +req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error:'Name required' });
    const ok = Labels.editLabelById(id,name);
    if (!ok) return res.status(404).json({ error:'Not found' });
    res.status(204).end();
};

exports.deleteLabel = (req,res) => {
    const id = +req.params.id;
    if (!Labels.deleteLabelById(id)) return res.status(404).json({ error:'Not found' });
    res.status(204).end();
};
