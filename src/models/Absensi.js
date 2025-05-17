
const db = require('../../config/db');

const Absensi = {

  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        a.id, a.mahasiswa_id, a.jadwal_id, a.check_in, a.check_out, a.status,
        m.nim, m.nama AS nama,
        mk.nama_mk, j.ruangan_id, j.hari
      FROM absensi a
      JOIN mahasiswa m ON a.mahasiswa_id = m.id
      JOIN jadwal_kelas j ON a.jadwal_id = j.id
      JOIN mata_kuliah mk ON j.matkul_id = mk.id
      ORDER BY a.check_in DESC
    `);
    return rows;
  },

  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO absensi (mahasiswa_id, jadwal_id, check_in, status, modified_by)
       VALUES (?, ?, ?, ?, ?)`,
      [data.mahasiswa_id, data.jadwal_id, data.check_in, data.status, data.modified_by]
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

  findByMahasiswaJadwalDate: async ({ mahasiswa_id, jadwal_id, date }) => {
  const [rows] = await db.query(
    `SELECT * FROM absensi 
     WHERE mahasiswa_id = ? AND jadwal_id = ? AND DATE(check_in) = ?`,
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
      m.nim, m.nama AS nama,
      mk.nama_mk, j.ruangan_id, j.hari
    FROM absensi a
    JOIN mahasiswa m ON a.mahasiswa_id = m.id
    JOIN jadwal_kelas j ON a.jadwal_id = j.id
    JOIN mata_kuliah mk ON j.matkul_id = mk.id
    WHERE DATE(a.check_in) = CURDATE()
    ORDER BY a.check_in DESC
  `);
  return rows;
},

  getTotal: async () => {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM absensi
      WHERE DATE(check_in) = CURDATE()
    `);
    return rows[0];
  }
};

module.exports = Absensi;
