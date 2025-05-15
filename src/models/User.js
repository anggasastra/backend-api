const db = require('../../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT id, username, role_id FROM users");
    return rows;
  }
};