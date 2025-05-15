const MataKuliah = require('../models/MataKuliah');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllMataKuliah = async (req, res) => {
  try {
    const data = await MataKuliah.getAll();
    return res.status(200).json(successResponse('Data mata kuliah berhasil diambil', data));
  } catch (error) {
    console.error('Error getAllMataKuliah:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createMataKuliah = async (req, res) => {
  const { kode_mk, sks, prodi_id, semester_id } = req.body;
  if (!kode_mk || ! || !sks || !prodi_id || !semester_id) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    const matkul = await MataKuliah.create({ kode_mk, sks, prodi_id, semester_id });
    return res.status(201).json(successResponse('Mata kuliah berhasil ditambahkan', matkul));
  } catch (error) {
    console.error('Error createMataKuliah:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateMataKuliah = async (req, res) => {
  const { id } = req.params;
  const { kode_mk, sks, prodi_id, semester_id } = req.body;

  try {
    const updated = await MataKuliah.update(id, { kode_mk, sks, prodi_id, semester_id });
    return res.status(200).json(successResponse('Mata kuliah berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateMataKuliah:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteMataKuliah = async (req, res) => {
  const { id } = req.params;

  try {
    await MataKuliah.delete(id);
    return res.status(200).json(successResponse('Mata kuliah berhasil dihapus'));
  } catch (error) {
    console.error('Error deleteMataKuliah:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};