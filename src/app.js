const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import route files
const authRoutes = require('./routes/auth');
const absensiRoutes = require('./routes/absensi');
const mahasiswaRoutes = require('./routes/mahasiswa');
const jadwalRoutes = require('./routes/jadwal');
const laporanRoutes = require('./routes/laporan');
const dosenRoutes = require('./routes/dosen');
const mataKuliahRoutes = require('./routes/mata-kuliah');
const prodiRoutes = require('./routes/prodi');
const ruanganRoutes = require('./routes/ruangan');
const scanRoutes = require('./routes/scan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Daftarkan route sesuai dengan base path-nya
app.use('/api/auth', authRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/mata-kuliah', mataKuliahRoutes);
app.use('/api/prodi', prodiRoutes);
app.use('/api/ruangan', ruanganRoutes);
app.use('/api/scan', scanRoutes);

// Middleware untuk menangani endpoint yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan' });
});

app.use(errorHandler);
module.exports = app;