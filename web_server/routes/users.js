// routes/users.js
// Author: Yuval Anteby, Dor Darmon

const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

// POST /api/users
router.post('/', controller.signupUser);

// GET /api/users/:id
router.get('/:id', controller.getUser);

// POST /api/users/login    (login)
router.post('/login', controller.loginUser);

module.exports = router;
