const express = require('express');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Tes koneksi dan route simple
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.send('Connected to MySQL!');
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database error');
  }
});

// Contoh endpoint: ambil semua user
app.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
