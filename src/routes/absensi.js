const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.post('/', absensiController.submitAbsensi);
router.get('/', absensiController.getAllAbsensi);
router.get('/new', absensiController.getAbsensi);
router.get('/total', absensiController.getTotalAbsen);

module.exports = router;
