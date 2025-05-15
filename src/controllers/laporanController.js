// src/controllers/laporanController.js
const db = require('../../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getLaporan = async (req, res) => {
  const { tanggal, ruangan, mahasiswa_id } = req.query;
  let sql = `
    SELECT 
      a.id,
      m.nama AS mahasiswa,
      j.kode_mk,
      j.nama_mk,
      j.ruangan_id,
      j.dosen_id,
      j.prodi_id,
      j.semester_id,
      j.hari,
      j.jam_mulai,
      j.jam_selesai,
      a.check_in,
      a.status AS status_absensi
    FROM absensi a
    JOIN mahasiswa m ON a.mahasiswa_id = m.id
    JOIN jadwal_kelas j ON a.jadwal_id = j.id
  `;
  const params = [];
  const conditions = [];

  if (tanggal) {
    conditions.push("DATE(a.check_in) = ?");
    params.push(tanggal);
  }
  if (ruangan) {
    conditions.push("j.ruangan_id = ?");
    params.push(ruangan);
  }
  if (mahasiswa_id) {
    conditions.push("m.id = ?");
    params.push(mahasiswa_id);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  try {
    const [rows] = await db.query(sql, params);
    return res.status(200).json(successResponse("Laporan absensi berhasil diambil", rows));
  } catch (error) {
    console.error('Error getLaporan:', error);
    return res.status(500).json(errorResponse('Internal server error'));
  }
};
