// src/controllers/jadwalController.js
const Jadwal = require('../models/Jadwal');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getJadwal = async (req, res) => {
  try {
    const { ruangan, hari } = req.query;
    const data = await Jadwal.getAll({ ruangan, hari });
    return res.status(200).json(successResponse("Data jadwal berhasil diambil", data));
  } catch (error) {
    console.error('Error getJadwal:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.createJadwal = async (req, res) => {
  const { kode_mk, nama_mk, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai } = req.body;
  if (!kode_mk || !nama_mk || !ruangan_id || !dosen_id || !prodi_id || !semester_id || !hari || !jam_mulai || !jam_selesai) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    const jadwal = await Jadwal.create({ kode_mk, nama_mk, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai });
    return res.status(201).json(successResponse('Jadwal kelas berhasil ditambahkan', jadwal));
  } catch (error) {
    console.error('Error createJadwal:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.updateJadwal = async (req, res) => {
  const { id } = req.params;
  const { kode_mk, nama_mk, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai } = req.body;

  try {
    const updated = await Jadwal.update(id, { kode_mk, nama_mk, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai });
    return res.status(200).json(successResponse('Data jadwal berhasil diperbarui', updated));
  } catch (error) {
    console.error('Error updateJadwal:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};

exports.deleteJadwal = async (req, res) => {
  const { id } = req.params;

  try {
    await Jadwal.delete(id);
    return res.status(200).json(successResponse('Data jadwal berhasil dihapus', null));
  } catch (error) {
    console.error('Error deleteJadwal:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};
