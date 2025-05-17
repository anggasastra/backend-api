const db = require('../../config/db');

module.exports = {
    getAll: async ({ ruangan, hari, prodi_id, semester_id } = {}) => {
    let sql = `
      SELECT 
        j.id, j.matkul_id, j.ruangan_id, j.dosen_id, j.prodi_id, j.semester_id, j.hari, j.jam_mulai, j.jam_selesai,
        mk.kode_mk, mk.nama_mk
      FROM jadwal_kelas j
      JOIN mata_kuliah mk ON j.matkul_id = mk.id
    `;
    const conditions = [];
    const params = [];

    if (ruangan) {
      conditions.push("j.ruangan_id = ?");
      params.push(ruangan);
    }
    if (hari) {
      conditions.push("j.hari = ?");
      params.push(hari);
    }
    if (prodi_id) {
      conditions.push("j.prodi_id = ?");
      params.push(prodi_id);
    }
    if (semester_id) {
      conditions.push("j.semester_id = ?");
      params.push(semester_id);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY j.hari, j.jam_mulai";

    const [rows] = await db.query(sql, params);
    return rows;
  },

  create: async ({ matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai }) => {
    const [result] = await db.query(
      "INSERT INTO jadwal_kelas (matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai]
    );
    return { id: result.insertId, matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai };
  },

  update: async (id, { matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai }) => {
    await db.query(
      `UPDATE jadwal_kelas SET 
        matkul_id = ?, 
        ruangan_id = ?, 
        dosen_id = ?, 
        prodi_id = ?, 
        semester_id = ?, 
        hari = ?, 
        jam_mulai = ?, 
        jam_selesai = ? 
      WHERE id = ?`,
      [matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai, id]
    );
    return { id, matkul_id, ruangan_id, dosen_id, prodi_id, semester_id, hari, jam_mulai, jam_selesai };
  },

  delete: async (id) => {
    await db.query("DELETE FROM jadwal_kelas WHERE id = ?", [id]);
    return;
  }
};
