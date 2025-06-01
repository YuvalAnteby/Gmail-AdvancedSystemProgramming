// Author: Yuval Anteby, Dor Darmon

const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

// POST /api/users
router.post('/users', controller.signupUser);

// GET /api/users/:id
router.get('/users/:id', controller.getUser);

// POST /api/users/login    (login)
router.post('/tokens', controller.loginUser);

module.exports = router;
