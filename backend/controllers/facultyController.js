const Faculty = require("../models/Faculty");

// Create Faculty
const createFaculty = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required",
      });
    }

    const existingFaculty = await Faculty.findOne({
      code: code.toUpperCase(),
    });

    if (existingFaculty) {
      return res.status(409).json({
        success: false,
        message: "Faculty with this code already exists",
      });
    }

    const faculty = await Faculty.create({
      name,
      code,
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create faculty",
      error: error.message,
    });
  }
};

// Get Faculties
const getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: faculties.length,
      data: faculties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch faculties",
      error: error.message,
    });
  }
};

module.exports = {
  createFaculty,
  getFaculties,
};