const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');

router
    .get('', controller.getLastMailsOrdered)
    .post('', controller.createNewMail);
router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.editMailById)
    .delete(controller.deleteMailById);
router.get('/search/:query/', controller.getMailsByQuery);

module.exports = router;