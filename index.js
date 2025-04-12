const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.DB_PORT;

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
