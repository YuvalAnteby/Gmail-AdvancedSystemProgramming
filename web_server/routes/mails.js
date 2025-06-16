const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');
const authenticateToken = require('../utils/authentication');
router
    .get('', authenticateToken, controller.getLastMailsOrdered)
    .post('', controller.createNewMail);
router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.updateMail)
    .delete(controller.deleteMailById);
router.get('/search/:query/', controller.getMailsByQuery);

module.exports = router;