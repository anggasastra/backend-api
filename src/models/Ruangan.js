const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM ruangan");
    return rows;
  },

  create: async ({ id, nama }) => {
    const [result] = await db.query("INSERT INTO ruangan (id, nama) VALUES (?, ?)", [id, nama]);
    return { id, nama };
  },

  update: async (id, { nama }) => {
    await db.query("UPDATE ruangan SET nama = ? WHERE id = ?", [nama, id]);
    return { id, nama };
  },

  delete: async (id) => {
    await db.query("DELETE FROM ruangan WHERE id = ?", [id]);
  },

  getTotal: async () => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM ruangan");
    return rows[0].total;
  }
};
