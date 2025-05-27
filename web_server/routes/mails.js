const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');

router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.editMailById)


module.exports = router;