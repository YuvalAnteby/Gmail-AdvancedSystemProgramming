//# Author: Yuval Anteby ,dor darmon 
const express = require('express')
var router = express.Router();
const controller = require('../controllers/users');

//signup
router.post('/api/users',controller.signupUser);

//regster 
router.post('/api/users/:id',controller.getUser);

//login
router.post('/api/tokens',controller.loginUser);

module.exports = router;