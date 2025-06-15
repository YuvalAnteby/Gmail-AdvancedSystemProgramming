// Author: Yuval Anteby,asd
// dordarmon2000@gmail.com
// •
// 2000/04/04
// Upload profile image (optional):
// No file chosen Dor Darmon

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
