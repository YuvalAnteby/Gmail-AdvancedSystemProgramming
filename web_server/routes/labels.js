const express = require('express');
const Auth    = require('../utils/authentication');
const ctrl    = require('../controllers/labels');
const router  = express.Router();

router.get   ('/',          Auth.authenticateToken, ctrl.getAllLabels);
router.post  ('/',          Auth.authenticateToken, ctrl.createNewLabel);
router.post  ('/:id/sublabel', Auth.authenticateToken, ctrl.createSublabel);
router.patch ('/:id',       Auth.authenticateToken, ctrl.editLabel);
router.delete('/:id',       Auth.authenticateToken, ctrl.deleteLabel);

module.exports = router;
