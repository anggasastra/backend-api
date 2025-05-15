// src/models/Jadwal.js
const db = require('../../config/db');

module.exports = {
  getAll: async ({ ruangan, hari } = {}) => {
    let sql = "SELECT * FROM jadwal_kelas";
    const params = [];

    if (ruangan || hari) {
      sql += " WHERE";
      if (ruangan) {
        sql += " ruangan_id = ?";
        params.push(ruangan);
      }
      if (hari) {
        sql += (ruangan ? " AND" : "") + " hari = ?";
        params.push(hari);
      }
    }
    const [rows] = await db.query(sql, params);
    return rows;
  },

  create: async ({ matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai }) => {
    const [result] = await db.query(
      "INSERT INTO jadwal_kelas (matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai]
    );
    return { id: result.insertId, matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai };
  },

  update: async (id, { matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai }) => {
    await db.query(
      "UPDATE jadwal_kelas SET matkul_id = ? = ?, ruangan_id = ?, dosen_id = ?, prodi_id = ?, semester_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ? WHERE id = ?",
      [matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai, id]
    );
    return { id, matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai };
  },

  delete: async (id) => {
    await db.query("DELETE FROM jadwal_kelas WHERE id = ?", [id]);
    return;
  }
};
