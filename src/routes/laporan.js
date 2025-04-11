// src/routes/laporan.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const verifyToken = require('../middleware/verifyToken');

// Ambil laporan absensi berdasarkan filter (tanggal, ruangan, mahasiswa_id)
router.get('/', verifyToken, laporanController.getLaporan);

module.exports = router;
