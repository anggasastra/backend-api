// models/MataKuliah.js
const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM mata_kuliah');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM mata_kuliah WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { kode_mk, nama_mk, sks, prodi_id, semester_id } = data;
    const [result] = await db.query(
      'INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, prodi_id, semester_id) VALUES (?, ?, ?, ?, ?)',
      [kode_mk, nama_mk, sks, prodi_id, semester_id]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { kode_mk, nama_mk, sks, prodi_id, semester_id } = data;
    await db.query(
      'UPDATE mata_kuliah SET kode_mk = ?, nama_mk = ?, sks = ?, prodi_id = ?, semester_id = ? WHERE id = ?',
      [kode_mk, nama_mk, sks, prodi_id, semester_id, id]
    );
    return { id, ...data };
  },

  delete: async (id) => {
    await db.query('DELETE FROM mata_kuliah WHERE id = ?', [id]);
  }
};
