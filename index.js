const app = require('./src/app');
const db = require('./config/db');
require('dotenv').config();


// Tes koneksi dan route simple
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.send('Database connected!');
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).send('Database error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
