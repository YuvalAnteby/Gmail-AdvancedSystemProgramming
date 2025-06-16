const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');
const authenticateToken = require('../utils/authentication');

router
    .get('', authenticateToken, controller.getLastMailsOrdered)
    .post('', authenticateToken, controller.createNewMail);
router.route('/:id')
    .get(authenticateToken, controller.getMailById)
    .patch(authenticateToken, controller.updateMail)
    .delete(authenticateToken, controller.deleteMailById);
router.get('/search/:query/', authenticateToken, controller.getMailsByQuery);

module.exports = router;