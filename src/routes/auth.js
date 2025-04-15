// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk login admin dan mendapatkan token JWT.
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
