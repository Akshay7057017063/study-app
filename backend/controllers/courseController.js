const Course = require("../models/Course");

// Create Course
const createCourse = async (req, res) => {
  try {
    const {
      collegeId,
      facultyId,
      name,
      shortName,
      duration,
    } = req.body;

    if (
      !collegeId ||
      !facultyId ||
      !name ||
      !shortName ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message:
          "College, faculty, name, shortName and duration are required",
      });
    }

    const existingCourse = await Course.findOne({
      collegeId,
      shortName: shortName.toUpperCase(),
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message:
          "Course with this shortName already exists in this college",
      });
    }

    const course = await Course.create({
      collegeId,
      facultyId,
      name,
      shortName,
      duration,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get Courses
const getCourses = async (req, res) => {
  try {
    const filter = {};

    if (req.query.collegeId) {
      filter.collegeId = req.query.collegeId;
    }

    if (req.query.facultyId) {
      filter.facultyId = req.query.facultyId;
    }

    const courses = await Course.find(filter)
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
};

// Update Course
const updateCourse = async (req, res) => {
  try {
    const { collegeId, facultyId, name, shortName, duration } = req.body;
    if (!collegeId || !facultyId || !name || !shortName || !duration) {
      return res.status(400).json({
        success: false,
        message: "College, faculty, name, shortName and duration are required",
      });
    }
    const existingCourse = await Course.findOne({
      collegeId,
      shortName: shortName.toUpperCase(),
      _id: { $ne: req.params.id },
    });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course with this shortName already exists in this college",
      });
    }
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { collegeId, facultyId, name, shortName, duration },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update course", error: error.message });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete course", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};