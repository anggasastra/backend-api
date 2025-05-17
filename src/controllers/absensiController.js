const { Mahasiswa, Jadwal, Absensi } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { broadcastAbsensiData } = require('../socket');

// Fungsi bantu
function combineDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`);
}

function addMenitToTime(timeStr, menit) {
  const [h, m, s] = timeStr.split(':').map(Number);
  const date = new Date(1970, 0, 1, h, m + menit, s || 0);
  return date.toTimeString().split(' ')[0]; // Format: HH:mm:ss
}

exports.submitAbsensi = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;

  console.log('====================');
  console.log('[RFID SCAN] Data Masuk:', { uid, deviceId, timestamp });

  if (!uid || !deviceId || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    // 1. Ambil data mahasiswa
    const mhsResult = await Mahasiswa.findByUID(uid);
    if (mhsResult.length === 0) {
      return res.status(404).json(errorResponse('Kamu Bukan Mahasiswa'));
    }
    const mahasiswa = mhsResult[0];
    const { id: mahasiswa_id, nama, prodi_id, semester_id } = mahasiswa;

    // 2. Parsing waktu (tidak diubah karena sudah ISO +08:00)
    const waktuScan = new Date(timestamp);
    const tanggalStr = timestamp.split('T')[0];
    const hari = waktuScan.toLocaleString('id-ID', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());

    // 3. Ambil jadwal sesuai ruangan, hari, prodi, semester
    const jadwalRows = await Jadwal.getAll({ ruangan: deviceId, hari, prodi_id, semester_id });
    if (jadwalRows.length === 0) {
      return res.status(403).json(errorResponse('Tidak ada jadwal'));
    }

    // 4. Cari jadwal aktif berdasar jam
    const jadwalAktif = jadwalRows.find(j => {
      const jamMulai = combineDateTime(tanggalStr, j.jam_mulai);
      const jamSelesai = combineDateTime(tanggalStr, j.jam_selesai);
      return waktuScan >= jamMulai && waktuScan <= jamSelesai;
    });

    if (!jadwalAktif) {
      return res.status(403).json(errorResponse('Tidak ada jadwal aktif saat ini'));
    }

    const { id: jadwal_id, matkul_id, jam_mulai, jam_selesai } = jadwalAktif;

    // 5. Cek apakah sudah absen hari ini
    const absensiHariIni = await Absensi.findByMahasiswaJadwalDate({
      mahasiswa_id,
      jadwal_id,
      date: tanggalStr
    });

    if (absensiHariIni.length > 0) {
      return res.status(200).json(successResponse('Kamu sudah absen hari ini'));
    }

    // 6. Tentukan status (ontime / late)
    const jamMulaiDate = combineDateTime(tanggalStr, jam_mulai);
    const batasOntimeDate = combineDateTime(tanggalStr, addMenitToTime(jam_mulai, 15));

    if (waktuScan < jamMulaiDate) {
      return res.status(403).json(errorResponse('Absensi terlalu awal'));
    }

    const status = waktuScan <= batasOntimeDate ? 'ontime' : 'late';

    // 7. Simpan ke database
    const absensi = await Absensi.create({
      mahasiswa_id,
      jadwal_id,
      check_in: timestamp,
      check_out: `${tanggalStr}T${jam_selesai}`,
      status,
      modified_by: null
    });

    const absensiData = {
      nama,
      status,
      waktu: timestamp,
      jenis: 'check-in',
      mata_kuliah: matkul_id
    };

    broadcastAbsensiData(absensiData);
    return res.status(200).json(successResponse('Absen Berhasil', absensiData));

  } catch (error) {
    console.error('[ERROR] submitAbsensi:', error);
    return res.status(500).json(errorResponse('Server error'));
  }
};