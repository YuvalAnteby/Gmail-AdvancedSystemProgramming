const express = require('express');
const router = express.Router();
const tokenManager = require('../controllers/tokenManager');
const controller = require("../models/blacklist");
//post for api/token
router.get('/', tokenManager.createToken());
///todo:edd delate
module.exports = router;