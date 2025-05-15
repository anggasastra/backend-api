// src/utils/dateHelper.js

/**
 * Mengubah objek Date atau string date menjadi format YYYY-MM-DD.
 * @param {Date|string} dateInput - Tanggal yang akan diformat.
 * @returns {string} Tanggal dalam format YYYY-MM-DD.
 */
function formatDate(dateInput) {
  const d = new Date(dateInput);
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  const year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  return [year, month, day].join('-');
}

/**
 * Mengubah objek Date atau string date menjadi format HH:mm:ss.
 * @param {Date|string} dateInput - Waktu yang akan diformat.
 * @returns {string} Waktu dalam format HH:mm:ss.
 */
function formatTime(dateInput) {
  const d = new Date(dateInput);
  return d.toTimeString().substr(0, 8);
}

module.exports = {
  formatDate,
  formatTime
};
