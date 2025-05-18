const { Mahasiswa, Jadwal, Absensi } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { broadcastAbsensiData } = require('../socket');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/id');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

// Fungsi bantu: tambah menit ke waktu HH:mm:ss
function addMenitToTime(timeStr, menit) {
  const [h, m, s] = timeStr.split(':').map(Number);
  const newTime = dayjs().hour(h).minute(m).second(s).add(menit, 'minute');
  return newTime.format('HH:mm:ss');
}

exports.submitAbsensi = async (req, res) => {
  const { uid, deviceId, timestamp } = req.body;

  console.log('====================');
  console.log('[RFID SCAN] Data Masuk:', { uid, deviceId, timestamp });

  if (!uid || !deviceId || !timestamp) {
    return res.status(400).json(errorResponse('Data tidak lengkap'));
  }

  try {
    const mhsResult = await Mahasiswa.findByUID(uid);
    if (mhsResult.length === 0) {
      return res.status(404).json(errorResponse('Kamu Bukan Mahasiswa'));
    }

    const mahasiswa = mhsResult[0];
    const { id: mahasiswa_id, nama, prodi_id, semester_id } = mahasiswa;

    // Parsing waktu dari timestamp + waktu Jakarta
    const waktuScan = dayjs(timestamp).tz('Asia/Makassar');
    const tanggalStr = waktuScan.format('YYYY-MM-DD');
    const hari = waktuScan.format('dddd'); // e.g., 'Senin'

    const jadwalRows = await Jadwal.getAll({ ruangan: deviceId, hari, prodi_id, semester_id });
    if (jadwalRows.length === 0) {
      return res.status(403).json(errorResponse('Tidak ada jadwal'));
    }

    console.log("Waktu Scan:", waktuScan.format());
    console.log("Jadwal:");

    const jadwalAktif = jadwalRows.find(j => {
      const jamMulai = dayjs(`${tanggalStr}T${j.jam_mulai}`).tz('Asia/Jakarta');
      const jamSelesai = dayjs(`${tanggalStr}T${j.jam_selesai}`).tz('Asia/Jakarta');
      return waktuScan.isAfter(jamMulai.subtract(1, 'minute')) && waktuScan.isBefore(jamSelesai.add(1, 'minute'));
    });

    if (!jadwalAktif) {
      return res.status(403).json(errorResponse('Tidak ada jadwal aktif saat ini'));
    }

    const { id: jadwal_id, matkul_id, jam_mulai, jam_selesai } = jadwalAktif;

    const absensiHariIni = await Absensi.findByMahasiswaJadwalDate({
      mahasiswa_id,
      jadwal_id,
      date: tanggalStr
    });

    if (absensiHariIni.length > 0) {
      return res.status(200).json(successResponse('Kamu sudah absen hari ini'));
    }

    // Penentuan status
    const jamMulaiDate = dayjs(`${tanggalStr}T${jam_mulai}`).tz('Asia/Jakarta');
    const batasOntime = jamMulaiDate.add(15, 'minute');

    if (waktuScan.isBefore(jamMulaiDate)) {
      return res.status(403).json(errorResponse('Absensi terlalu awal'));
    }

    const status = waktuScan.isSameOrBefore(batasOntime) ? 'ontime' : 'late';

    const checkInTime = waktuScan.format(); // ISO format waktu lokal
    const checkOutTime = dayjs(`${tanggalStr}T${jam_selesai}`).tz('Asia/Jakarta').format();

    const absensi = await Absensi.create({
      mahasiswa_id,
      jadwal_id,
      check_in: checkInTime,
      check_out: checkOutTime,
      status,
      modified_by: null
    });

    const absensiData = {
      nama,
      status,
      waktu: checkInTime,
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
