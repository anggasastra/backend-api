const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.post('/', absensiController.submitAbsensi);

module.exports = router;
