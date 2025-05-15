const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.status(200).json({
      status: 'success',
      message: 'Koneksi database berhasil',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
      error: error.message,
    });
  }
});

module.exports = router;
