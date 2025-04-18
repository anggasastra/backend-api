const db = require('../../config/db');

const Absensi = {

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
  },

  getLatest: async () => {
    const [rows] = await db.query(`
      SELECT 
        a.id, a.mahasiswa_id, a.jadwal_id, a.check_in, a.check_out, a.status,
        m.nim, m.nama AS nama_mahasiswa,
        j.nama_mk, j.ruangan_id
      FROM absensi a
      JOIN mahasiswa m ON a.mahasiswa_id = m.id
      JOIN jadwal_kelas j ON a.jadwal_id = j.id
      ORDER BY a.check_in DESC
      LIMIT 10
    `);
    return rows;
  }
};

module.exports = Absensi;
