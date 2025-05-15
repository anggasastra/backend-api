const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM mata_kuliah");
    return rows;
  },

  create: async ({ kode_mk, nama_mk, sks, prodi_id, semester_id }) => {
    const [result] = await db.query(
      "INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, prodi_id, semester_id) VALUES (?, ?, ?, ?, ?)",
      [kode_mk, nama_mk, sks, prodi_id, semester_id]
    );
    return { id: result.insertId, kode_mk, nama_mk, sks, prodi_id, semester_id };
  },

  update: async (id, { kode_mk, nama_mk, sks, prodi_id, semester_id }) => {
    await db.query(
      "UPDATE mata_kuliah SET kode_mk = ?, nama_mk = ?, sks = ?, prodi_id = ?, semester_id = ? WHERE id = ?",
      [kode_mk, nama_mk, sks, prodi_id, semester_id, id]
    );
    return { id, kode_mk, nama_mk, sks, prodi_id, semester_id };
  },

  delete: async (id) => {
    await db.query("DELETE FROM mata_kuliah WHERE id = ?", [id]);
  }
};