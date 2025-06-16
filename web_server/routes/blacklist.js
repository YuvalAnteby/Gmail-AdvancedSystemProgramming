const express = require('express')
var router = express.Router();
const controller = require('../controllers/blacklist');
const authenticateToken = require("../utils/authentication");

router
    .post('/', authenticateToken, controller.addToBlacklist)
    .get('/:url', authenticateToken, controller.isInBlacklist)
    .delete('/:url', authenticateToken, controller.deleteFromBlacklist);

module.exports = router;
