const Role = require('../models/Role');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllRoles = async (req, res) => {
  try {
    const data = await Role.getAll();
    res.status(200).json(successResponse("Data role berhasil diambil", data));
  } catch (error) {
    console.error('Error getAllRoles:', error);
    res.status(500).json(errorResponse("Internal server error"));
  }
};