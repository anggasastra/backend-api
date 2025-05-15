const express = require('express');
const router = express.Router();
const ruanganController = require('../controllers/ruanganController');

router.get('/', ruanganController.getAllRuangan);
router.get('/total', ruanganController.getTotalRuangan);
router.post('/', ruanganController.createRuangan);
router.put('/:id', ruanganController.updateRuangan);
router.delete('/:id', ruanganController.deleteRuangan);

module.exports = router;