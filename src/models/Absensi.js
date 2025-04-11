const pool = require('../../config/db');

const Absensi = {
  create: async (data) => {
    const [result] = await pool.query(
      `INSERT INTO absensi (mahasiswa_id, jadwal_id, check_in, status)
       VALUES (?, ?, ?, ?)`,
      [data.mahasiswa_id, data.jadwal_id, data.check_in, data.status]
    );
    return { id: result.insertId };
  },

  findPendingCheckout: async ({ mahasiswa_id, jadwal_id, date }) => {
    const [rows] = await pool.query(
      `SELECT * FROM absensi 
       WHERE mahasiswa_id = ? AND jadwal_id = ? 
       AND DATE(check_in) = ? AND check_out IS NULL`,
      [mahasiswa_id, jadwal_id, date]
    );
    return rows;
  },

  updateCheckout: async ({ id, check_out, modified_by }) => {
    await pool.query(
      `UPDATE absensi SET check_out = ?, modified_by = ? WHERE id = ?`,
      [check_out, modified_by, id]
    );
  }
};

module.exports = Absensi;
