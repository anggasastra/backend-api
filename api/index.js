<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('../src/routes/auth');
const absensiRoutes = require('../src/routes/absensi');
const mahasiswaRoutes = require('../src/routes/mahasiswa');
const jadwalRoutes = require('../src/routes/jadwal');
const laporanRoutes = require('../src/routes/laporan');
const dosenRoutes = require('../src/routes/dosen');
const mataKuliahRoutes = require('../src/routes/mata-kuliah');
const prodiRoutes = require('../src/routes/prodi');
const ruanganRoutes = require('../src/routes/ruangan');
const scanRoutes = require('../src/routes/scan');

// Middleware dan logger
const logger = require('../src/utils/logger');
const errorHandler = require('../src/middleware/errorHandler');

app.use(logger);

// Routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use(errorHandler);

// Export handler ke Vercel
module.exports = app;
module.exports.handler = serverless(app);
=======
const app = require('../src/app');
module.exports = app;
>>>>>>> 67791e2 (Reorganize project for Vercel deployment)
