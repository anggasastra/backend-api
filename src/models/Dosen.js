const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM dosen");
    return rows;
  },

  create: async ({ kode_dosen, nama, prodi_id, role_id = 2 }) => {
    const [result] = await db.query(
      "INSERT INTO dosen (kode_dosen, nama, prodi_id, role_id) VALUES (?, ?, ?, ?)",
      [kode_dosen, nama, prodi_id, role_id]
    );
    return { id: result.insertId, kode_dosen, nama, prodi_id, role_id };
  },

  update: async (id, { kode_dosen, nama, prodi_id, role_id }) => {
    await db.query(
      "UPDATE dosen SET kode_dosen = ?, nama = ?, prodi_id = ?, role_id = ? WHERE id = ?",
      [kode_dosen, nama, prodi_id, role_id, id]
    );
    return { id, kode_dosen, nama, prodi_id, role_id };
  },

  delete: async (id) => {
    await db.query("DELETE FROM dosen WHERE id = ?", [id]);
  },

  getTotal: async () => {
    try {
      const [rows] = await db.query("SELECT COUNT(*) AS total FROM dosen");
      return rows[0].total;
    } catch (error) {
      console.error("Gagal mengambil total dosen:", error);
      throw error;
    }
  }
};
