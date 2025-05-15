const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Menyimpan scan
router.post('/', scanController.saveScan);
router.get('/', scanController.getLatestScan);
router.delete('/',scanController.clearScan);

module.exports = router;
