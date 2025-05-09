const Ruangan = require('../models/Ruangan');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllRuangan = async (req, res) => {
  try {
    const data = await Ruangan.getAll();
    return res.status(200).json(successResponse('Data ruangan berhasil diambil', data));
  } catch (error) {
    console.error('Error getAllRuangan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createRuangan = async (req, res) => {
  const { id, nama } = req.body;
  if (!id || !nama) return res.status(400).json(errorResponse('ID dan nama ruangan wajib diisi'));

  try {
    const ruangan = await Ruangan.create({ id, nama });
    return res.status(201).json(successResponse('Ruangan berhasil ditambahkan', ruangan));
  } catch (error) {
    console.error('Error createRuangan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateRuangan = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  try {
    const updated = await Ruangan.update(id, { nama });
    return res.status(200).json(successResponse('Ruangan berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateRuangan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteRuangan = async (req, res) => {
  const { id } = req.params;

  try {
    await Ruangan.delete(id);
    return res.status(200).json(successResponse('Ruangan berhasil dihapus'));
  } catch (error) {
    console.error('Error deleteRuangan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.getTotalRuangan = async (req, res) => {
  try {
    const total = await Ruangan.getTotal();
    return res.status(200).json(successResponse('Total ruangan berhasil dihitung', { total }));
  } catch (error) {
    console.error('Error getTotalRuangan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};
