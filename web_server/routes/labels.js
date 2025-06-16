const express = require('express');
const router = express.Router();
const controller = require('../controllers/labels');
const Auth = require("../utils/authentication");

router
    .get('/', Auth.authenticateToken, controller.getAllLabels)
    .post('/', Auth.authenticateToken, controller.createNewLabel)
    .get('/:id', Auth.authenticateToken, controller.getLabelById)
    .patch('/:id', Auth.authenticateToken, controller.editLabel)
    .delete('/:id', Auth.authenticateToken, controller.deleteLabel);
module.exports = router;
