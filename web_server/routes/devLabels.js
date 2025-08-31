const express = require('express');
const Label = require('../db/models/Label');
const Counter = require('../db/models/Counter');

const router = express.Router();

// GET /dev/labels/count - returns number of label documents
router.get('/count', async (req, res) => {
  try {
    const total = await Label.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count labels' });
  }
});

// POST /dev/labels/seed - create a few labels for a given owner
router.post('/seed', async (req, res) => {
  try {
    const owner = Number(req.body.owner || 1);
    const names = req.body.names || ['work', 'friends'];
    const created = [];
    for (const name of names) {
      try {
        // generate numeric id using counters via direct increment
        // we rely on application-level creation through the model (controllers cover uniqueness)
        const next = await Counter.findByIdAndUpdate('labels', { $inc: { seq: 1 } }, { new: true, upsert: true });
        const doc = await Label.create({ id: next.seq, owner, name, parent: null });
        created.push({ id: doc.id, name: doc.name });
      } catch (e) {
        // ignore duplicates
      }
    }
    res.json({ created });
  } catch (e) {
    res.status(500).json({ error: 'Failed to seed labels' });
  }
});

// GET /dev/labels/list?owner=1
router.get('/list', async (req, res) => {
  try {
    const owner = Number(req.query.owner || 1);
    const labels = await Label.find({ owner }).sort({ id: 1 }).lean();
    res.json(labels.map(l => ({ id: l.id, name: l.name, parent: l.parent })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to list labels' });
  }
});

module.exports = router;


