// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Jika header sudah dikirim, panggil next(err) untuk memaksa Express menangani error
  if (res.headersSent) {
    return next(err);
  }

  // Menentukan status code default ke 500 (Internal Server Error)
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan pada server'
  });
};
