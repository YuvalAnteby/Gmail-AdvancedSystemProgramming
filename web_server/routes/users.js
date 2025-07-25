// Author: Yuval Anteby, Dor Darmon

const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const {authenticateToken} = require("../utils/authentication");

// POST /api/users
router.post('/users', controller.signupUser);

// GET /api/users/search?q=alice
router.get('/users/search', authenticateToken, controller.searchUsers);


// GET /api/users/:id
router.get('/users/:id', controller.getUser);

// PATCH /api/users/:id
router.patch('/users/:id', controller.editUser);

// POST /api/users/login    (login)
router.post('/tokens', controller.loginUser);

// GET /api/auth-check
router.get('/auth-check', authenticateToken, controller.isTokenValid)


module.exports = router;
