const MataKuliah = require('../models/MataKuliah');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllMataKuliah = async (req, res) => {
  try {
    const data = await MataKuliah.getAll();
    return res.status(200).json(successResponse('Data mata kuliah berhasil diambil', data));
  } catch (error) {
    console.error('Error getAllMataKuliah:', error);
    return res.status(500).json(errorResponse('Terjadi kesalahan pada server'));
  }
};

exports.getMataKuliahById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await MataKuliah.getById(id);
    if (!data) {
      return res.status(404).json(errorResponse('Mata kuliah tidak ditemukan'));
    }
    return res.status(200).json(successResponse('Data mata kuliah berhasil ditemukan', data));
  } catch (error) {
    console.error('Error getMataKuliahById:', error);
    return res.status(500).json(errorResponse('Terjadi kesalahan pada server'));
  }
};

exports.createMataKuliah = async (req, res) => {
  const { kode_mk, nama_mk, sks, prodi_id, semester_id } = req.body;

  if (!kode_mk || !nama_mk || !sks || !prodi_id || !semester_id) {
    return res.status(400).json(errorResponse('Semua field wajib diisi'));
  }

  try {
    const created = await MataKuliah.create({ kode_mk, nama_mk, sks, prodi_id, semester_id });
    return res.status(201).json(successResponse('Mata kuliah berhasil ditambahkan', created));
  } catch (error) {
    console.error('Error createMataKuliah:', error);
    return res.status(500).json(errorResponse('Terjadi kesalahan saat menambahkan data'));
  }
};

exports.updateMataKuliah = async (req, res) => {
  const { id } = req.params;
  const { kode_mk, nama_mk, sks, prodi_id, semester_id } = req.body;

  if (!kode_mk || !nama_mk || !sks || !prodi_id || !semester_id) {
    return res.status(400).json(errorResponse('Semua field wajib diisi'));
  }

  try {
    const existing = await MataKuliah.getById(id);
    if (!existing) {
      return res.status(404).json(errorResponse('Mata kuliah tidak ditemukan'));
    }

    const updated = await MataKuliah.update(id, { kode_mk, nama_mk, sks, prodi_id, semester_id });
    return res.status(200).json(successResponse('Mata kuliah berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateMataKuliah:', error);
    return res.status(500).json(errorResponse('Terjadi kesalahan saat memperbarui data'));
  }
};

exports.deleteMataKuliah = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await MataKuliah.getById(id);
    if (!existing) {
      return res.status(404).json(errorResponse('Mata kuliah tidak ditemukan'));
    }

    await MataKuliah.delete(id);
    return res.status(200).json(successResponse('Mata kuliah berhasil dihapus'));
  } catch (error) {
    console.error('Error deleteMataKuliah:', error);
    return res.status(500).json(errorResponse('Terjadi kesalahan saat menghapus data'));
  }
};
