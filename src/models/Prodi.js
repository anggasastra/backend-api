const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM prodi");
    return rows;
  },

  create: async ({ nama }) => {
    const [result] = await db.query("INSERT INTO prodi (nama_prodi) VALUES (?)", [nama]);
    return { id: result.insertId, nama };
  },

  update: async (id, { nama }) => {
    await db.query("UPDATE prodi SET nama_prodi = ? WHERE id = ?", [nama, id]);
    return { id, nama };
  },

  delete: async (id) => {
    await db.query("DELETE FROM prodi WHERE id = ?", [id]);
  }
};