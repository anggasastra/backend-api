const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// GET semua user (memerlukan token)
router.get('/', verifyToken, userController.getAllUsers);

module.exports = router;