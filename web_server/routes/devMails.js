const express = require('express');
const Mail = require('../db/models/Mail');
const Counter = require('../db/models/Counter');

const router = express.Router();

// GET /dev/mails/count - returns number of mail documents
router.get('/count', async (req, res) => {
  try {
    const total = await Mail.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to count mails' });
  }
});

// GET /dev/mails/list?owner=1
router.get('/list', async (req, res) => {
  try {
    const owner = Number(req.query.owner || 1);
    const mails = await Mail.find({ owner }).sort({ createdAt: -1 }).lean();
    res.json(
      mails.map(m => ({ id: m.id, subject: m.subject, isDraft: m.isDraft, labels: m.labels || [] }))
    );
  } catch (e) {
    res.status(500).json({ error: 'Failed to list mails' });
  }
});

// POST /dev/mails/seed - create a couple of mails for owner
router.post('/seed', async (req, res) => {
  try {
    const owner = Number(req.body.owner || 1);
    const now = new Date();
    const samples = [
      { subject: 'Hello', body: 'Hi there', from: owner, sentTo: [owner], labels: [], isDraft: false },
      { subject: 'Draft 1', body: 'Work in progress', from: owner, sentTo: [owner], labels: [], isDraft: true }
    ];
    const created = [];
    for (const s of samples) {
      const next = await Counter.findByIdAndUpdate('mails', { $inc: { seq: 1 } }, { new: true, upsert: true });
      const doc = await Mail.create({ id: next.seq, owner, ...s, createdAt: now, updatedAt: now });
      created.push({ id: doc.id, subject: doc.subject, isDraft: doc.isDraft });
    }
    res.json({ created });
  } catch (e) {
    res.status(500).json({ error: 'Failed to seed mails' });
  }
});

module.exports = router;


