const express = require('express');
const router = express.Router();
const controller = require('../controllers/labels');
console.log('controller:', controller);

router
    .get('/', controller.getAllLabels)
    .post('/', controller.createNewLabel)
    .get('/:id', controller.getLabelById)
    .patch('/:id', controller.editLabel)
    .delete('/:id', controller.deleteLabel);
module.exports = router;
