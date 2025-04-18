const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM dosen");
    return rows;
  },

  create: async ({ nama }) => {
    const [result] = await db.query("INSERT INTO dosen (nama) VALUES (?)", [nama]);
    return { id: result.insertId, nama };
  },

  update: async (id, { nama }) => {
    await db.query("UPDATE dosen SET nama = ? WHERE id = ?", [nama, id]);
    return { id, nama };
  },

  delete: async (id) => {
    await db.query("DELETE FROM dosen WHERE id = ?", [id]);
  }
};