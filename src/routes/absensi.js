const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.post('/', absensiController.submitAbsensi);
router.get('/', absensiController.getAllAbsensi);

module.exports = router;
