const Syllabus = require("../models/Syllabus");

// Create Syllabus
const createSyllabus = async (req, res) => {
  try {
    const {
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
      title,
      description,
      academicYear,
      fileUrl,
      fileName,
    } = req.body;

    if (
      !universityId ||
      !collegeId ||
      !facultyId ||
      !courseId ||
      !branchId ||
      !semesterId ||
      !subjectId ||
      !title ||
      !academicYear ||
      !fileUrl ||
      !fileName
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const existingSyllabus = await Syllabus.findOne({
      subjectId,
      academicYear: academicYear.trim(),
    });

    if (existingSyllabus) {
      return res.status(409).json({
        success: false,
        message: "Syllabus for this subject and academic year already exists",
      });
    }

    const syllabus = await Syllabus.create({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
      title,
      description,
      academicYear,
      fileUrl,
      fileName,
    });

    return res.status(201).json({
      success: true,
      message: "Syllabus created successfully",
      data: syllabus,
    });
  } catch (error) {
    console.error("Create Syllabus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create syllabus",
      error: error.message,
    });
  }
};

// Get Syllabus
const getSyllabus = async (req, res) => {
  try {
    const filter = {};

    if (req.query.universityId) filter.universityId = req.query.universityId;
    if (req.query.collegeId) filter.collegeId = req.query.collegeId;
    if (req.query.facultyId) filter.facultyId = req.query.facultyId;
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.branchId) filter.branchId = req.query.branchId;
    if (req.query.semesterId) filter.semesterId = req.query.semesterId;
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;
    if (req.query.academicYear) {
      filter.academicYear = req.query.academicYear;
    }

    const syllabus = await Syllabus.find(filter)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code")
      .sort({ academicYear: -1, title: 1 });

    return res.status(200).json({
      success: true,
      count: syllabus.length,
      data: syllabus,
    });
  } catch (error) {
    console.error("Get Syllabus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch syllabus",
      error: error.message,
    });
  }
};

// Get Syllabus By ID
const getSyllabusById = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code");

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: syllabus,
    });
  } catch (error) {
    console.error("Get Syllabus By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch syllabus",
      error: error.message,
    });
  }
};

// Update Syllabus
const updateSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Syllabus updated successfully",
      data: syllabus,
    });
  } catch (error) {
    console.error("Update Syllabus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update syllabus",
      error: error.message,
    });
  }
};

// Delete Syllabus
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findByIdAndDelete(req.params.id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Syllabus deleted successfully",
    });
  } catch (error) {
    console.error("Delete Syllabus Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete syllabus",
      error: error.message,
    });
  }
};

module.exports = {
  createSyllabus,
  getSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus,
};