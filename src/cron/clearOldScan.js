const scanController = require('../controllers/scanController');

// Fungsi untuk clear scanMap setiap 5 detik (atau sesuai jadwal)
const clearOldScan = () => {
  scanController.clearScanMap(); // method ini kamu buat di scanController
};

module.exports = clearOldScan;
