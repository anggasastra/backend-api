const Dosen = require('../models/Dosen');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllDosen = async (req, res) => {
  try {
    const data = await Dosen.getAll();
    return res.status(200).json(successResponse('Data dosen berhasil diambil', data));
  } catch (error) {
    console.error('Error getAllDosen:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createDosen = async (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json(errorResponse('Nama dosen wajib diisi'));

  try {
    const dosen = await Dosen.create({ nama });
    return res.status(201).json(successResponse('Dosen berhasil ditambahkan', dosen));
  } catch (error) {
    console.error('Error createDosen:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateDosen = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  try {
    const updated = await Dosen.update(id, { nama });
    return res.status(200).json(successResponse('Dosen berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateDosen:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteDosen = async (req, res) => {
  const { id } = req.params;

  try {
    await Dosen.delete(id);
    return res.status(200).json(successResponse('Dosen berhasil dihapus'));
  } catch (error) {
    console.error('Error deleteDosen:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};