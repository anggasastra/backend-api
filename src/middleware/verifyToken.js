// src/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Token biasanya dikirim dengan format "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token tidak tersedia' });
  }

  // Verifikasi token menggunakan JWT_SECRET dari .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 'error', message: 'Token tidak valid' });
    }

    // Jika token valid, lampirkan data decoded ke request (misalnya user ID, role, dsb.)
    req.user = decoded;
    next();
  });
console.log("JWT dari env:", process.env.JWT_SECRET);

};
