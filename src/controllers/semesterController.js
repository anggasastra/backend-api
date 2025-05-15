const Semester = require('../models/Semester');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.getAllSemesters = async (req, res) => {
  try {
    const data = await Semester.getAll();
    res.status(200).json(successResponse("Data semester berhasil diambil", data));
  } catch (error) {
    console.error('Error getAllSemesters:', error);
    res.status(500).json(errorResponse("Internal server error"));
  }
};