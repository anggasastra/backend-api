const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.getAll();
    res.status(200).json(successResponse("Data user berhasil diambil", data));
  } catch (error) {
    console.error('Error getAllUsers:', error);
    res.status(500).json(errorResponse("Internal server error"));
  }
};