const { successResponse, errorResponse } = require('../utils/responseHelper');

// Penyimpanan sementara di memory
let latestScan = {};  // Menyimpan scan terakhir berdasarkan uid

// Menyimpan scan
exports.saveScan = async (req, res) => {
  const { uid, timestamp } = req.body;

  // Cek apakah data lengkap
  if (!uid || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  // Simpan data scan terakhir berdasarkan uid
  latestScan = { uid, timestamp };

  // Kirim response sukses
  return res.status(200).json(successResponse('Scan berhasil disimpan'));
};

// Mendapatkan scan terakhir yang masuk (terakhir berdasarkan uid)
exports.getLatestScan = async (req, res) => {
  // Cek apakah ada data scan yang sudah tersimpan
  if (!latestScan.uid) {
    return res.status(404).json(errorResponse('Belum ada data scan'));
  }

  // Kirim response sukses dengan data scan terakhir
  return res.status(200).json(successResponse('Data scan terakhir ditemukan', latestScan));
};

// Optional: untuk menghapus scan setelah diproses
exports.clearScan = async (req, res) => {
  if (!latestScan.uid) {
    return res.status(404).json(errorResponse('Tidak ada data scan untuk dihapus'));
  }
  latestScan = {};
  return res.status(200).json(successResponse('Scan berhasil dihapus'));
};
