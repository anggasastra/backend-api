const { Mahasiswa, Jadwal, Absensi } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { broadcastAbsensiData } = require('../socket');

exports.submitAbsensi = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;

  console.log('====================');
  console.log('[RFID SCAN] Data Masuk:', { uid, deviceId, timestamp });

  if (!uid || !deviceId || !timestamp) {
    console.log('[ERROR] Data tidak lengkap');
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    const mhsResult = await Mahasiswa.findByUID(uid);
    if (mhsResult.length === 0) {
      console.log('[NOT FOUND] Mahasiswa tidak ditemukan:', uid);
      return res.status(404).json(errorResponse('Mahasiswa tidak ditemukan'));
    }
    const mahasiswa = mhsResult[0];
    console.log('[MAHASISWA] Ditemukan:', mahasiswa.nama);

    const waktuScan = new Date(timestamp);
    const tanggalStr = timestamp.split('T')[0];

    // Pastikan hari dari enum cocok dengan database (gunakan lowercase)
    const hari = waktuScan.toLocaleString('id-ID', { weekday: 'long' }).toLowerCase();
    console.log('[WAKTU] Scan:', waktuScan.toLocaleString(), '| Hari:', hari);

    const jadwalRows = await Jadwal.getAll({ ruangan: deviceId, hari });
    console.log('[JADWAL] Ditemukan:', jadwalRows.length);

    const jadwalAktif = jadwalRows.find(j => {
      const jamMulai = new Date(`${tanggalStr}T${j.jam_mulai}`);
      const jamSelesai = new Date(`${tanggalStr}T${j.jam_selesai}`);
      return waktuScan >= jamMulai && waktuScan <= jamSelesai;
    });

    if (!jadwalAktif) {
      console.log('[JADWAL] Tidak ada jadwal aktif di waktu ini');
      return res.status(403).json(errorResponse('Tidak ada jadwal aktif saat ini'));
    }

    console.log('[JADWAL AKTIF] Mata Kuliah:', jadwalAktif.nama_mk);

    const pendingRows = await Absensi.findPendingCheckout({
      mahasiswa_id: mahasiswa.id,
      jadwal_id: jadwalAktif.id,
      date: tanggalStr
    });

    if (pendingRows.length > 0) {
      console.log('[CHECK-OUT] Absensi ID:', pendingRows[0].id);
      await Absensi.updateCheckout({
        id: pendingRows[0].id,
        check_out: timestamp,
        modified_by: null // sistem, tidak diedit oleh user
      });
      console.log('[CHECK-OUT] Berhasil untuk:', mahasiswa.nama);
      const absensiData = {
        nama: mahasiswa.nama,
        status: 'checkout',
        waktu: timestamp,
        jenis: 'check-out',
        mata_kuliah: jadwalAktif.nama_mk
      };
      broadcastAbsensiData(absensiData);
      return res.status(200).json(successResponse('Berhasil check-out', absensiData));
    } else {
      const jamMulai = new Date(`${tanggalStr}T${jadwalAktif.jam_mulai}`);
      const status = (waktuScan <= new Date(jamMulai.getTime() + 15 * 60 * 1000)) ? 'ontime' : 'late';

      const absensi = await Absensi.create({
        mahasiswa_id: mahasiswa.id,
        jadwal_id: jadwalAktif.id,
        check_in: timestamp,
        status,
        modified_by: null
      });

      console.log('[CHECK-IN] Status:', status, '| ID:', absensi.id);
      const absensiData = {
        nama: mahasiswa.nama,
        status,
        waktu: timestamp,
        jenis: 'check-in',
        mata_kuliah: jadwalAktif.nama_mk
      };
    broadcastAbsensiData(absensiData);
    return res.status(200).json(successResponse('Berhasil check-in', absensiData));
    }

  } catch (error) {
    console.error('[ERROR] submitAbsensi:', error);
    return res.status(500).json(errorResponse('Server error'));
  }
};

exports.getAbsensi = async (req, res) => {
  try {
    const data = await Absensi.getLatest();
    return res.status(200).json(successResponse('Data absensi terbaru berhasil diambil', data));
  } catch (error) {
    console.error('[ERROR] getAbsensiTerbaru:', error);
    return res.status(500).json(errorResponse('Gagal mengambil data absensi terbaru'));
  }
};