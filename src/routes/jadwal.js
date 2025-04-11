// src/routes/jadwal.js
const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwalController');
const verifyToken = require('../middleware/verifyToken');

// Ambil data jadwal kelas
router.get('/', verifyToken, jadwalController.getJadwal);

// Tambah data jadwal baru
router.post('/', verifyToken, jadwalController.createJadwal);

// Update data jadwal berdasarkan ID
router.put('/:id', verifyToken, jadwalController.updateJadwal);

// Hapus data jadwal berdasarkan ID
router.delete('/:id', verifyToken, jadwalController.deleteJadwal);

module.exports = router;
