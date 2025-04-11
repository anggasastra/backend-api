const { successResponse, errorResponse } = require('../utils/responseHelper');

// Penyimpanan sementara di memory
const latestScans = {};  // Key: deviceId, Value: { uid, deviceId, timestamp }

exports.saveScan = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;

  if (!uid || !deviceId || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  // Simpan di memory
  latestScans[deviceId] = { uid, deviceId, timestamp };

  return res.status(200).json(successResponse('Scan berhasil disimpan'));
};

exports.getLatestScanByDevice = async (req, res) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json(errorResponse('Device ID diperlukan'));
  }

  const data = latestScans[deviceId];
  if (!data) {
    return res.status(404).json(errorResponse('Belum ada data scan untuk device ini'));
  }

  return res.status(200).json(successResponse('Data scan ditemukan', data));
};

// Optional: untuk menghapus setelah diproses
exports.clearScan = (deviceId) => {
  delete latestScans[deviceId];
};
