const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.get('/', absensiController.submitAbsensi);
router.get('/new', absensiController.getAbsensi);
router.get('/total', absensiController.getTotalAbsen);
router.post('/', absensiController.submitAbsensi);

module.exports = router;
