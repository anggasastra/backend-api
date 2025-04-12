const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Import route files
const authRoutes = require('./src/routes/auth');
const absensiRoutes = require('./src/routes/absensi');
const mahasiswaRoutes = require('./src/routes/mahasiswa');
const jadwalRoutes = require('./src/routes/jadwal');
const laporanRoutes = require('./src/routes/laporan');
const dosenRoutes = require('./src/routes/dosen');
const mataKuliahRoutes = require('./src/routes/mata-kuliah');
const prodiRoutes = require('./src/routes/prodi');
const ruanganRoutes = require('./src/routes/ruangan');
const scanRoutes = require('./src/routes/scan');

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

// Middleware untuk endpoint tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan'
  });
});

app.use(errorHandler);

module.exports = app;
