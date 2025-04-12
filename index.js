const app = require('./src/app');
require('dotenv').config();

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Server backend berjalan');
});
