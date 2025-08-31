const express = require('express');
const User = require('../db/models/User');
const Counter = require('../db/models/Counter');

const router = express.Router();

router.get('/count', async (req, res) => {
  try {
    const total = await User.countDocuments();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ error: 'Failed to count users' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json(users.map(u => ({ id: u.id, fullName: u.fullName, mail: u.mail })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const toCreate = req.body.users || [
      { fullName: 'Alice Example', mail: 'alice@example.com', password: 'pass', dateOfBirth: '1990-01-01', image: '' },
      { fullName: 'Bob Example', mail: 'bob@example.com', password: 'pass', dateOfBirth: '1992-02-02', image: '' },
    ];
    const created = [];
    for (const u of toCreate) {
      const updated = await Counter.findByIdAndUpdate('users', { $inc: { seq: 1 } }, { new: true, upsert: true });
      const id = updated.seq;
      try {
        const doc = await User.create({ id, ...u });
        created.push({ id: doc.id, mail: doc.mail });
      } catch (e) {
        // ignore duplicates
      }
    }
    res.json({ created });
  } catch (e) {
    res.status(500).json({ error: 'Failed to seed users' });
  }
});

module.exports = router;
