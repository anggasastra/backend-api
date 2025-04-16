// src/utils/responseHelper.js

/**
 * Membuat format respons untuk permintaan yang sukses.
 * @param {string} message - Pesan informasi.
 * @param {Object|Array|null} data - Data yang akan dikembalikan.
 * @returns {Object} Respons dengan format standar.
 */
function successResponse(message, data) {
  return {
    status: 'success',
    message,
    data
  };
}

/**
 * Membuat format respons untuk permintaan yang gagal.
 * @param {string} message - Pesan error.
 * @returns {Object} Respons error dengan format standar.
 */
function errorResponse(message) {
  return {
    status: 'error',
    message
  };
}

module.exports = {
  successResponse,
  errorResponse
};
