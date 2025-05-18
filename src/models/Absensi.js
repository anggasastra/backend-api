const db = require('../../config/db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = 'Asia/Makassar'; // WITA = GMT+8

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
    const startOfDay = dayjs.tz(date, tz).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs.tz(date, tz).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const [rows] = await db.query(
      `SELECT * FROM absensi 
       WHERE mahasiswa_id = ? AND jadwal_id = ? 
       AND check_in BETWEEN ? AND ? AND check_out IS NULL`,
      [mahasiswa_id, jadwal_id, startOfDay, endOfDay]
    );
    return rows;
  },

  findByMahasiswaJadwalDate: async ({ mahasiswa_id, jadwal_id, date }) => {
    const startOfDay = dayjs.tz(date, tz).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfDay = dayjs.tz(date, tz).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const [rows] = await db.query(
      `SELECT * FROM absensi 
       WHERE mahasiswa_id = ? AND jadwal_id = ? 
       AND check_in BETWEEN ? AND ?`,
      [mahasiswa_id, jadwal_id, startOfDay, endOfDay]
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
    const todayStart = dayjs().tz(tz).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const todayEnd = dayjs().tz(tz).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const [rows] = await db.query(`
      SELECT 
        a.id, a.mahasiswa_id, a.jadwal_id, a.check_in, a.check_out, a.status,
        m.nim, m.nama AS nama,
        mk.nama_mk, j.ruangan_id, j.hari
      FROM absensi a
      JOIN mahasiswa m ON a.mahasiswa_id = m.id
      JOIN jadwal_kelas j ON a.jadwal_id = j.id
      JOIN mata_kuliah mk ON j.matkul_id = mk.id
      WHERE a.check_in BETWEEN ? AND ?
      ORDER BY a.check_in DESC
    `, [todayStart, todayEnd]);

    return rows;
  },

  getTotal: async () => {
    const todayStart = dayjs().tz(tz).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const todayEnd = dayjs().tz(tz).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const [rows] = await db.query(`
      SELECT COUNT(*) AS total
      FROM absensi
      WHERE check_in BETWEEN ? AND ?
    `, [todayStart, todayEnd]);

    return rows[0];
  }
};

module.exports = Absensi;
