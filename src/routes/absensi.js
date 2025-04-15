const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.get('/new', absensiController.getAbsensi);
router.post('/', absensiController.submitAbsensi);

module.exports = router;
