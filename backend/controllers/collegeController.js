const College = require("../models/College");

// Create College
const createCollege = async (req, res) => {
  try {
    const { universityId, name, code, city } = req.body;

    if (!universityId || !name || !code || !city) {
      return res.status(400).json({
        success: false,
        message: "University, name, code and city are required",
      });
    }

    const existingCollege = await College.findOne({
      universityId,
      code: code.toUpperCase(),
    });

    if (existingCollege) {
      return res.status(409).json({
        success: false,
        message: "College with this code already exists",
      });
    }

    const college = await College.create({
      universityId,
      name,
      code,
      city,
    });

    res.status(201).json({
      success: true,
      message: "College created successfully",
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create college",
      error: error.message,
    });
  }
};

// Get Colleges
const getColleges = async (req, res) => {
  try {
    const filter = {};

    if (req.query.universityId) {
      filter.universityId = req.query.universityId;
    }

    const colleges = await College.find(filter)
      .populate("universityId", "name shortName code")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch colleges",
      error: error.message,
    });
  }
};

module.exports = {
  createCollege,
  getColleges,
};
