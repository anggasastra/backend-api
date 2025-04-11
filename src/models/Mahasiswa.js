// src/models/Mahasiswa.js
const db = require('../../config/db');

module.exports = {
  findByUID: async (uid) => {
    const [rows] = await db.query("SELECT * FROM mahasiswa WHERE rfid_uid = ?", [uid]);
    return rows;
  },

  getAll: async ({ prodi, semester } = {}) => {
    let sql = "SELECT * FROM mahasiswa";
    const params = [];

    if (prodi || semester) {
      sql += " WHERE";
      if (prodi) {
        sql += " prodi_id = ?";
        params.push(prodi);
      }
      if (semester) {
        sql += (prodi ? " AND" : "") + " semester_id = ?";
        params.push(semester);
      }
    }
    const [rows] = await db.query(sql, params);
    return rows;
  },

  create: async ({ nama, nim, uid, prodi, semester }) => {
    const [result] = await db.query(
      "INSERT INTO mahasiswa (nama, nim, rfid_uid, prodi_id, semester_id) VALUES (?, ?, ?, ?, ?)",
      [nama, nim, uid, prodi, semester]
    );
    return { id: result.insertId, nama, nim, uid, prodi, semester };
  },

  update: async (id, { nama, nim, uid, prodi, semester }) => {
    await db.query(
      "UPDATE mahasiswa SET nama = ?, nim = ?, rfid_uid = ?, prodi_id = ?, semester_id = ? WHERE id = ?",
      [nama, nim, uid, prodi, semester, id]
    );
    return { id, nama, nim, uid, prodi, semester };
  },

  delete: async (id) => {
    await db.query("DELETE FROM mahasiswa WHERE id = ?", [id]);
    return;
  }
};
