const express = require('express')
var router = express.Router();
const controller = require('../controllers/blacklist');

router
    .post(   '/',     controller.addToBlacklist)
    .get(    '/:url', controller.isInBlacklist)
    .delete('/:url',  controller.deleteFromBlacklist);

module.exports = router;
