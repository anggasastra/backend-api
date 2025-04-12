const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Menyimpan scan
router.post('/', scanController.saveScan);
router.get('/', scanController.getLatestScan);

module.exports = router;
