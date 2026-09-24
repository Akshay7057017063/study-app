const University = require("../models/University");

// Create University
const createUniversity = async (req, res) => {
  try {
    const { name, shortName, code } = req.body;

    if (!name || !shortName || !code) {
      return res.status(400).json({
        success: false,
        message: "Name, shortName and code are required",
      });
    }

    const existingUniversity = await University.findOne({
      code: code.toUpperCase(),
    });

    if (existingUniversity) {
      return res.status(409).json({
        success: false,
        message: "University with this code already exists",
      });
    }

    const university = await University.create({
      name,
      shortName,
      code,
    });

    res.status(201).json({
      success: true,
      message: "University created successfully",
      data: university,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create university",
      error: error.message,
    });
  }
};

// Get all Universities
const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
      error: error.message,
    });
  }
};

module.exports = {
  createUniversity,
  getUniversities,
};
