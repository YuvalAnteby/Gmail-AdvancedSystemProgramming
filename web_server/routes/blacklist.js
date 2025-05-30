const express = require('express')
var router = express.Router();
const controller = require('../controllers/blacklist');

router
    .post('', controller.addToBlacklist)
   // .delete('', controller.deleteFromBlacklist);

module.exports = router;