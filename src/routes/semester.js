const express = require('express');
const router = express.Router();
const semesterController = require('../controllers/semesterController');

// GET semua semester
router.get('/', semesterController.getAllSemesters);

module.exports = router;