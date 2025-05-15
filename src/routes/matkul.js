const express = require('express');
const router = express.Router();
const mataKuliahController = require('../controllers/mataKuliahController');

router.get('/', mataKuliahController.getAllMataKuliah);
router.post('/', mataKuliahController.createMataKuliah);
router.put('/:id', mataKuliahController.updateMataKuliah);
router.delete('/:id', mataKuliahController.deleteMataKuliah);

module.exports = router;
