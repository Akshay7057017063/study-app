const Semester = require("../models/Semester");

// Create Semester
const createSemester = async (req, res) => {
  try {
    const {
      branchId,
      semesterNumber,
      academicYear,
    } = req.body;

    if (!branchId || !semesterNumber || !academicYear) {
      return res.status(400).json({
        success: false,
        message:
          "Branch, semesterNumber and academicYear are required",
      });
    }

    const existingSemester = await Semester.findOne({
      branchId,
      semesterNumber,
    });

    if (existingSemester) {
      return res.status(409).json({
        success: false,
        message:
          "This semester already exists for this branch",
      });
    }

    const semester = await Semester.create({
      branchId,
      semesterNumber,
      academicYear,
    });

    res.status(201).json({
      success: true,
      message: "Semester created successfully",
      data: semester,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create semester",
      error: error.message,
    });
  }
};

// Get Semesters
const getSemesters = async (req, res) => {
  try {
    const filter = {};

    if (req.query.branchId) {
      filter.branchId = req.query.branchId;
    }

    const semesters = await Semester.find(filter)
      .populate("branchId", "name code")
      .sort({ semesterNumber: 1 });

    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch semesters",
      error: error.message,
    });
  }
};

module.exports = {
  createSemester,
  getSemesters,
};