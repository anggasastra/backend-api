const { Mahasiswa, Jadwal, Absensi } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { broadcastAbsensiData } = require('../socket');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localeID = require('dayjs/locale/id');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

// ===== [POST] SUBMIT ABSENSI =====
exports.submitAbsensi = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;
  console.log('====================');
  console.log('[RFID SCAN] Data Masuk:', { uid, deviceId, timestamp });

  if (!uid || !deviceId || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    // --- [1] Cek Mahasiswa ---
    const mhs = await Mahasiswa.findByUID(uid);
    if (mhs.length === 0) {
      return res.status(404).json(errorResponse('Kamu Bukan Mahasiswa'));
    }

    const mahasiswa = mhs[0];
    const { id: mahasiswa_id, nama, prodi_id, semester_id } = mahasiswa;

    // --- [2] Konversi waktu UTC ke GMT+8 (lokal) ---
    const waktuScan = dayjs.utc(timestamp).tz('Asia/Makassar');
    const tanggalStr = waktuScan.format('YYYY-MM-DD');
    const hari = waktuScan.format('dddd');
    console.log('[DEBUG] waktuScan:', waktuScan.format());
    console.log('[DEBUG] Hari:', hari);

    // --- [3] Ambil dan filter Jadwal ---
    const jadwalList = await Jadwal.getAll({ ruangan: deviceId, hari, prodi_id, semester_id });
    if (jadwalList.length === 0) {
      return res.status(403).json(errorResponse('Tidak ada jadwal'));
    }

    const jadwalAktif = jadwalList.find(j => {
      const mulai = dayjs(`${tanggalStr}T${j.jam_mulai}`).tz('Asia/Makassar');
      const selesai = dayjs(`${tanggalStr}T${j.jam_selesai}`).tz('Asia/Makassar');
      return waktuScan.isAfter(mulai) && waktuScan.isBefore(selesai);
    });

    if (!jadwalAktif) {
      return res.status(403).json(errorResponse('Tidak ada jadwal aktif saat ini'));
    }

    const { id: jadwal_id, matkul_id, jam_mulai, jam_selesai } = jadwalAktif;
    const jamMulai = dayjs(`${tanggalStr}T${jam_mulai}`).tz('Asia/Makassar');
    const jamSelesai = dayjs(`${tanggalStr}T${jam_selesai}`).tz('Asia/Makassar');

    if (!waktuScan.isAfter(jamMulai)) {
      console.log('[DEBUG] Absensi terlalu awal');
      return res.status(403).json(errorResponse('Absensi terlalu awal'));
    }
    if (!waktuScan.isBefore(jamSelesai)) {
      console.log('[DEBUG] Absensi sudah lewat');
      return res.status(403).json(errorResponse('Absensi sudah berakhir'));
    }

    // --- [4] Cek apakah sudah absen ---
    const sudahAbsen = await Absensi.findByMahasiswaJadwalDate({ mahasiswa_id, jadwal_id, date: tanggalStr });
    if (sudahAbsen.length > 0) {
      return res.status(200).json(successResponse('Kamu sudah absen hari ini'));
    }

    // --- [5] Validasi waktu absensi ---
    if (waktuScan.isBefore(jamMulai)) {
      return res.status(403).json(errorResponse('Absensi terlalu awal'));
    }

    const batasOntime = jamMulai.add(15, 'minute');
    const status = waktuScan.isBefore(batasOntime) || waktuScan.isSame(batasOntime)
      ? 'ontime'
      : 'late';

    // --- [6] Simpan absensi (UTC) ---
    const absensi = await Absensi.create({
      mahasiswa_id,
      jadwal_id,
      check_in: dayjs.utc().toDate(),
      check_out: jamSelesai.utc().toDate(),
      status,
      modified_by: null
    });

    // --- [7] Broadcast dan respons ---
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

// ===== [GET] SEMUA ABSENSI =====
exports.getAllAbsensi = async (_req, res) => {
  try {
    const data = await Absensi.getAll();
    return res.status(200).json(successResponse('Data absensi berhasil diambil', data));
  } catch (error) {
    console.error('[ERROR] getAllAbsensi:', error);
    return res.status(500).json(errorResponse('Gagal mengambil data absensi'));
  }
};

// ===== [GET] ABSENSI TERBARU =====
exports.getAbsensi = async (_req, res) => {
  try {
    const data = await Absensi.getLatest();
    return res.status(200).json(successResponse('Data absensi terbaru berhasil diambil', data));
  } catch (error) {
    console.error('[ERROR] getAbsensiTerbaru:', error);
    return res.status(500).json(errorResponse('Gagal mengambil data absensi terbaru'));
  }
};

// ===== [GET] TOTAL ABSENSI HARI INI =====
exports.getTotalAbsen = async (_req, res) => {
  try {
    const total = await Absensi.getTotal();
    return res.status(200).json(successResponse('Total absensi hari ini berhasil diambil', total));
  } catch (error) {
    console.error('[ERROR] getTotalAbsen:', error);
    return res.status(500).json(errorResponse('Gagal mengambil total absensi hari ini'));
  }
};
