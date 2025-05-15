const app = require('./src/app');
const db = require('./config/db');
require('dotenv').config();

const http = require('http');
const { setupWebSocket } = require('./src/socket');

// Buat server HTTP manual
const server = http.createServer(app);

// Setup WebSocket
setupWebSocket(server);

// Tes koneksi DB
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
