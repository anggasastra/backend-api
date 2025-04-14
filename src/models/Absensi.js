const db = require('../../config/db');

const Absensi = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM absensi");
    return rows;
  },

  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO absensi (mahasiswa_id, jadwal_id, check_in, status)
       VALUES (?, ?, ?, ?)`,
      [data.mahasiswa_id, data.jadwal_id, data.check_in, data.status]
    );
    return { id: result.insertId };
  },

  findPendingCheckout: async ({ mahasiswa_id, jadwal_id, date }) => {
    const [rows] = await db.query(
      `SELECT * FROM absensi 
       WHERE mahasiswa_id = ? AND jadwal_id = ? 
       AND DATE(check_in) = ? AND check_out IS NULL`,
      [mahasiswa_id, jadwal_id, date]
    );
    return rows;
  },

  updateCheckout: async ({ id, check_out, modified_by }) => {
    await db.query(
      `UPDATE absensi SET check_out = ?, modified_by = ? WHERE id = ?`,
      [check_out, modified_by, id]
    );
  }
};

module.exports = Absensi;
