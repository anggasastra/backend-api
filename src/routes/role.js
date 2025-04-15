const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// GET semua role
router.get('/', roleController.getAllRoles);

module.exports = router;