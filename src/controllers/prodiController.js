const Prodi = require('../models/Prodi');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllProdi = async (req, res) => {
  try {
    const data = await Prodi.getAll();
    return res.status(200).json(successResponse('Data prodi berhasil diambil', data));
  } catch (error) {
    console.error('Error getAllProdi:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createProdi = async (req, res) => {
  const { nama } = req.body;
  if (!nama) return res.status(400).json(errorResponse('Nama prodi wajib diisi'));

  try {
    const prodi = await Prodi.create({ nama });
    return res.status(201).json(successResponse('Prodi berhasil ditambahkan', prodi));
  } catch (error) {
    console.error('Error createProdi:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateProdi = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  try {
    const updated = await Prodi.update(id, { nama });
    return res.status(200).json(successResponse('Prodi berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateProdi:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteProdi = async (req, res) => {
  const { id } = req.params;

  try {
    await Prodi.delete(id);
    return res.status(200).json(successResponse('Prodi berhasil dihapus'));
  } catch (error) {
    console.error('Error deleteProdi:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};
