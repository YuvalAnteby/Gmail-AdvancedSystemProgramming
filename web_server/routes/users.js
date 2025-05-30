//# Author: Yuval Anteby ,dor darmon 
const express = require('express')
var router = express.Router();
const controller = require('../controllers/users');

// Signup regster a new user
router.post('/api/users',controller.signupUser);

// Get user by ID
router.get('/api/users/:id',controller.getUser);

// Login in to user
router.post('/api/tokens',controller.loginUser);

module.exports = router;