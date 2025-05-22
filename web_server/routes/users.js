const express = require('express')
var router = express.Router();
const controller = require('../controllers/users');

/**
 * GET user by their ID
 */
router.route('/:id').get(controller.getUserById)

module.exports = router;