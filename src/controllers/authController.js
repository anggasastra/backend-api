const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');
require('dotenv').config();

// === LOGIN ===
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(errorResponse('Username dan password harus diisi'));
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    console.log('Username:', username);
    console.log('Hasil query:', rows);

    if (!user) {
      return res.status(401).json(errorResponse('Username atau password salah'));
    }

    // Fix prefix jika hash dari PHP (opsional)
    const hashToCompare = user.password.replace('$2y$', '$2b$');
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!isMatch) {
      return res.status(401).json(errorResponse('Username atau password salah'));
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role_id || 'admin'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("JWT dari env:", process.env.JWT_SECRET);

    return res.status(200).json(successResponse('Login berhasil', {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role || 'admin'
      }
    }));
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json(errorResponse('Terjadi kesalahan saat login'));
  }
};

// === REGISTER ===
exports.register = async (req, res) => {
  const { username, password, role_id = 1 } = req.body;

  if (!username || !password) {
    return res.status(400).json(errorResponse('Username dan password harus diisi'));
  }

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json(errorResponse('Username sudah digunakan'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)',
      [username, hashedPassword, role_id]
    );

    return res.status(201).json(successResponse('User berhasil terdaftar'));
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json(errorResponse('Terjadi kesalahan saat registrasi'));
  }
};
