const express = require('express')
var router = express.Router();
const controller = require('../controllers/mails');
const Auth = require('../utils/authentication');

router
    .get('', Auth.authenticateToken, controller.getLastMailsOrdered)
    .post('', Auth.authenticateToken, controller.createNewMail);
router.route('/:id')
    .get(Auth.authenticateToken, controller.getMailById)
    .patch(Auth.authenticateToken, controller.updateMail)
    .delete(Auth.authenticateToken, controller.deleteMailById);
router.get('/search/:query/', Auth.authenticateToken, controller.getMailsByQuery);

module.exports = router;