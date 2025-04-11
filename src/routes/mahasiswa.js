// src/routes/mahasiswa.js
const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const verifyToken = require('../middleware/verifyToken'); // Middleware otentikasi JWT

// Ambil data mahasiswa (dengan filter opsional)
router.get('/', verifyToken, mahasiswaController.getMahasiswa);

// Tambah data mahasiswa
router.post('/', verifyToken, mahasiswaController.createMahasiswa);

// Update data mahasiswa berdasarkan ID
router.put('/:id', verifyToken, mahasiswaController.updateMahasiswa);

// Hapus data mahasiswa berdasarkan ID
router.delete('/:id', verifyToken, mahasiswaController.deleteMahasiswa);

module.exports = router;
