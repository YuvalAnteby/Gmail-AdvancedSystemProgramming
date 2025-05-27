const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');

router.get('/:query', controller.getMailsByQuery);

module.exports = router;