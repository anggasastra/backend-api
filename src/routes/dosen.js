const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');

router.get('/', dosenController.getAllDosen);
router.get('/total', dosenController.getTotalDosen);
router.post('/', dosenController.createDosen);
router.put('/:id', dosenController.updateDosen);
router.delete('/:id', dosenController.deleteDosen);

module.exports = router;