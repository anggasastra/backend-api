// src/routes/mahasiswa.js
const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const verifyToken = require('../middleware/verifyToken'); // Middleware otentikasi JWT

router.get('/', verifyToken, mahasiswaController.getMahasiswa);
router.get('/total', mahasiswaController.getTotalMahasiswa);
router.post('/', verifyToken, mahasiswaController.createMahasiswa);
router.put('/:id', verifyToken, mahasiswaController.updateMahasiswa);
router.delete('/:id', verifyToken, mahasiswaController.deleteMahasiswa);

module.exports = router;
