const Branch = require("../models/Branch");

// Create Branch
const createBranch = async (req, res) => {
  try {
    const { courseId, name, code } = req.body;

    if (!courseId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "Course, name and code are required",
      });
    }

    const existingBranch = await Branch.findOne({
      courseId,
      code: code.toUpperCase(),
    });

    if (existingBranch) {
      return res.status(409).json({
        success: false,
        message: "Branch with this code already exists in this course",
      });
    }

    const branch = await Branch.create({
      courseId,
      name,
      code,
    });

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

// Get Branches
const getBranches = async (req, res) => {
  try {
    const filter = {};

    if (req.query.courseId) {
      filter.courseId = req.query.courseId;
    }

    const branches = await Branch.find(filter)
      .populate("courseId", "name shortName duration")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getBranches,
};