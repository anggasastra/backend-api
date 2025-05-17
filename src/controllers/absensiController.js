const { Mahasiswa, Jadwal, Absensi } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { broadcastAbsensiData } = require('../socket');

exports.submitAbsensi = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;

  console.log('====================');
  console.log('[RFID SCAN] Data Masuk:', { uid, deviceId, timestamp });

  if (!uid || !deviceId || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    // 1. Ambil Mahasiswa
    const mhsResult = await Mahasiswa.findByUID(uid);
    if (mhsResult.length === 0) {
      return res.status(404).json(errorResponse('Kamu Bukan Mahasiswa'));
    }
    const mahasiswa = mhsResult[0];
    const { id: mahasiswa_id, nama, prodi_id, semester_id } = mahasiswa;

    const waktuScan = new Date(timestamp);
    const tanggalStr = timestamp.split('T')[0];
    const hari = waktuScan.toLocaleString('id-ID', { weekday: 'long' }).toLowerCase();

    // 2. Ambil Jadwal Sesuai Parameter
    const jadwalRows = await Jadwal.getAll({ ruangan: deviceId, hari, prodi_id, semester_id });
    if (jadwalRows.length === 0) {
      return res.status(403).json(errorResponse('Tidak ada jadwal'));
    }

    // 3. Temukan Jadwal Aktif
    const jadwalAktif = jadwalRows.find(j => {
      const jamMulai = new Date(j.jam_mulai);
      const jamSelesai = new Date(j.jam_selesai);
      return waktuScan >= jamMulai && waktuScan <= jamSelesai;
    });

    if (!jadwalAktif) {
      return res.status(403).json(errorResponse('Tidak ada jadwal aktif'));
    }

    const { id: jadwal_id, matkul_id, jam_mulai, jam_selesai } = jadwalAktif;

    // 4. Cek Apakah Sudah Absen Hari Ini
    const absensiHariIni = await Absensi.findByMahasiswaJadwalDate({
      mahasiswa_id,
      jadwal_id,
      date: tanggalStr
    });

    if (absensiHariIni.length > 0) {
      return res.status(200).json(successResponse('Kamu sudah absen hari ini'));
    }

    // 5. Hitung Status (ontime / late)
    const jamMulaiDate = new Date(`${tanggalStr}T${jam_mulai}`);
    const batasOntime = new Date(jamMulaiDate.getTime() + 15 * 60 * 1000);

    let status;
    if (waktuScan < jamMulaiDate) {
      return res.status(403).json(errorResponse('Absensi terlalu awal'));
    } else if (waktuScan <= batasOntime) {
      status = 'ontime';
    } else {
      status = 'late';
    }

    // 6. Buat Absensi (Check-in, Auto Checkout)
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
    return res.status(200).json(successResponse('Berhasil check-in', absensiData));

  } catch (error) {
    console.error('[ERROR] submitAbsensi:', error);
    return res.status(500).json(errorResponse('Server error'));
  }
};


exports.getAllAbsensi = async (req, res) => {
  try {
    const data = await Absensi.getAll();
    return res.status(200).json(successResponse('Data absensi berhasil diambil', data));
  } catch (error) {
    console.error('[ERROR] getAllAbsensi:', error);
    return res.status(500).json(errorResponse('Gagal mengambil data absensi'));
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

exports.getTotalAbsen = async (req, res) => {
  try {
    const total = await Absensi.getTotal();
    return res.status(200).json(successResponse('Total absensi hari ini berhasil diambil', total));
  } catch (error) {
    console.error('[ERROR] getTotalAbsen:', error);
    return res.status(500).json(errorResponse('Gagal mengambil total absensi hari ini'));
  }
};
