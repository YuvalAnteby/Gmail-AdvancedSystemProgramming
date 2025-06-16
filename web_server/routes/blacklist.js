const express = require('express')
var router = express.Router();
const controller = require('../controllers/blacklist');
const Auth = require("../utils/authentication");

router
    .post('/', Auth.authenticateToken, controller.addToBlacklist)
    .get('/:url', Auth.authenticateToken, controller.isInBlacklist)
    .delete('/:url', Auth.authenticateToken, controller.deleteFromBlacklist);

module.exports = router;
