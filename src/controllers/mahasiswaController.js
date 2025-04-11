// src/controllers/mahasiswaController.js
const Mahasiswa = require('../models/Mahasiswa');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getMahasiswa = async (req, res) => {
  try {
    const { prodi, semester } = req.query;
    const data = await Mahasiswa.getAll({ prodi, semester });
    return res.status(200).json(successResponse("Data mahasiswa berhasil diambil", data));
  } catch (error) {
    console.error('Error getMahasiswa:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createMahasiswa = async (req, res) => {
  const { nama, nim, uid, prodi, semester } = req.body;
  if (!nama || !nim || !uid || !prodi || !semester) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    const mahasiswa = await Mahasiswa.create({ nama, nim, uid, prodi, semester });
    return res.status(201).json(successResponse('Data mahasiswa berhasil ditambahkan', mahasiswa));
  } catch (error) {
    console.error('Error createMahasiswa:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateMahasiswa = async (req, res) => {
  const { id } = req.params;
  const { nama, nim, uid, prodi, semester } = req.body;

  try {
    const updated = await Mahasiswa.update(id, { nama, nim, uid, prodi, semester });
    return res.status(200).json(successResponse('Data mahasiswa berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateMahasiswa:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteMahasiswa = async (req, res) => {
  const { id } = req.params;

  try {
    await Mahasiswa.delete(id);
    return res.status(200).json(successResponse('Data mahasiswa berhasil dihapus', null));
  } catch (error) {
    console.error('Error deleteMahasiswa:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};
