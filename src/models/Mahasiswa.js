// src/models/Mahasiswa.js
const db = require('../../config/db');

module.exports = {
  findByUID: async (uid) => {
    const [rows] = await db.query("SELECT * FROM mahasiswa WHERE uid = ?", [uid]);
    return rows;
  },

  getAll: async ({ prodi_id, semester_id } = {}) => {
    let sql = "SELECT * FROM mahasiswa";
    const params = [];

    if (prodi_id || semester_id) {
      sql += " WHERE";
      if (prodi_id) {
        sql += " prodi_id = ?";
        params.push(prodi_id);
      }
      if (semester_id) {
        sql += (prodi_id ? " AND" : "") + " semester_id = ?";
        params.push(semester_id);
      }
    }
    const [rows] = await db.query(sql, params);
    return rows;
  },

  getTotal: async () => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM mahasiswa");
    return rows[0].total;
  },

  create: async ({ nama, nim, uid, prodi_id, semester_id }) => {
    const [result] = await db.query(
      "INSERT INTO mahasiswa (nama, nim, uid, prodi_id, semester_id) VALUES (?, ?, ?, ?, ?)",
      [nama, nim, uid, prodi_id, semester_id]
    );
    return { id: result.insertId, nama, nim, uid, prodi_id, semester_id };
  },

  update: async (id, { nama, nim, uid, prodi_id, semester_id }) => {
    await db.query(
      "UPDATE mahasiswa SET nama = ?, nim = ?, uid = ?, prodi_id = ?, semester_id = ? WHERE id = ?",
      [nama, nim, uid, prodi_id, semester_id, id]
    );
    return { id, nama, nim, uid, prodi_id, semester_id };
  },

  delete: async (id) => {
    await db.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
    return;
  }
};
