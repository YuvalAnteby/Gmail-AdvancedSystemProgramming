const express = require('express')
var router = express.Router();
const controller = require('../controllers/labels');
router
    .get('', controller.getAllLabels)
    .post('', controller.createNewLabel);
module.exports = router;