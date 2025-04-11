const db = require('../../config/db');


module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ruangan");
    return rows;
  },

  create: async ({ id, nama}) => {
    const [result] = await db.query("INSERT INTO ruangan (id, nama_ruangan) VALUES (?, ?)", [id, nama]);
    return { id, nama };
  },

  update: async (id, { nama }) => {
    await db.query("UPDATE ruangan SET nama_ruangan = ? WHERE id = ?", [nama, id]);
    return { id, nama };
  },

  delete: async (id) => {
    await db.query("DELETE FROM ruangan WHERE id = ?", [id]);
  }
};