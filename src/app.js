const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const absensiRoutes = require('./routes/absensi');
const mahasiswaRoutes = require('./routes/mahasiswa');
const jadwalRoutes = require('./routes/jadwal');
const laporanRoutes = require('./routes/laporan');
const dosenRoutes = require('./routes/dosen');
const mataKuliahRoutes = require('./routes/matkul');
const prodiRoutes = require('./routes/prodi');
const ruanganRoutes = require('./routes/ruangan');
const scanRoutes = require('./routes/scan');
const dbRoutes = require('./routes/db');
const semesterRoutes = require('./routes/semester');
const roleRoutes = require('./routes/role');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/matkul', mataKuliahRoutes);
app.use('/api/prodi', prodiRoutes);
app.use('/api/ruangan', ruanganRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/semester', semesterRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);

// Middleware untuk endpoint tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan'
  });
});

app.use(errorHandler);

module.exports = app;
