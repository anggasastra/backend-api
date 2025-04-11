const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/', scanController.saveScan);
router.get('/:deviceId', scanController.getLatestScanByDevice);

module.exports = router;
