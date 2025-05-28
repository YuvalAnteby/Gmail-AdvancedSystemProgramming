const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');

router
    .get('', controller.getLastMailsOrdered)
    .post('', controller.createNewMail);

module.exports = router;