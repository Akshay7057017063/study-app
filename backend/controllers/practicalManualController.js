const PracticalManual = require("../models/PracticalManual");

// Create Practical Manual
const createPracticalManual = async (req, res) => {
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
      year,
      fileUrl,
      fileName,
    } = req.body;

    // Required fields validation
    if (
      !universityId ||
      !collegeId ||
      !facultyId ||
      !courseId ||
      !branchId ||
      !semesterId ||
      !subjectId ||
      !title ||
      !year ||
      !fileUrl ||
      !fileName
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Check duplicate manual
    const existingManual = await PracticalManual.findOne({
      subjectId,
      title: title.trim(),
      year,
    });

    if (existingManual) {
      return res.status(409).json({
        success: false,
        message: "Practical manual with this title and year already exists",
      });
    }

    // Create manual
    const practicalManual = await PracticalManual.create({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
      title,
      description,
      year,
      fileUrl,
      fileName,
    });

    return res.status(201).json({
      success: true,
      message: "Practical manual created successfully",
      data: practicalManual,
    });
  } catch (error) {
    console.error("Create Practical Manual Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create practical manual",
      error: error.message,
    });
  }
};

// Get Practical Manuals
const getPracticalManuals = async (req, res) => {
  try {
    const filter = {};

    if (req.query.universityId) {
      filter.universityId = req.query.universityId;
    }

    if (req.query.collegeId) {
      filter.collegeId = req.query.collegeId;
    }

    if (req.query.facultyId) {
      filter.facultyId = req.query.facultyId;
    }

    if (req.query.courseId) {
      filter.courseId = req.query.courseId;
    }

    if (req.query.branchId) {
      filter.branchId = req.query.branchId;
    }

    if (req.query.semesterId) {
      filter.semesterId = req.query.semesterId;
    }

    if (req.query.subjectId) {
      filter.subjectId = req.query.subjectId;
    }

    if (req.query.year) {
      filter.year = Number(req.query.year);
    }

    const practicalManuals = await PracticalManual.find(filter)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code")
      .sort({ year: -1, title: 1 });

    return res.status(200).json({
      success: true,
      count: practicalManuals.length,
      data: practicalManuals,
    });
  } catch (error) {
    console.error("Get Practical Manuals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch practical manuals",
      error: error.message,
    });
  }
};

// Get Practical Manual By ID
const getPracticalManualById = async (req, res) => {
  try {
    const practicalManual = await PracticalManual.findById(req.params.id)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code");

    if (!practicalManual) {
      return res.status(404).json({
        success: false,
        message: "Practical manual not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: practicalManual,
    });
  } catch (error) {
    console.error("Get Practical Manual Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch practical manual",
      error: error.message,
    });
  }
};

// Update Practical Manual
const updatePracticalManual = async (req, res) => {
  try {
    const practicalManual = await PracticalManual.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!practicalManual) {
      return res.status(404).json({
        success: false,
        message: "Practical manual not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Practical manual updated successfully",
      data: practicalManual,
    });
  } catch (error) {
    console.error("Update Practical Manual Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update practical manual",
      error: error.message,
    });
  }
};

// Delete Practical Manual
const deletePracticalManual = async (req, res) => {
  try {
    const practicalManual = await PracticalManual.findByIdAndDelete(
      req.params.id
    );

    if (!practicalManual) {
      return res.status(404).json({
        success: false,
        message: "Practical manual not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Practical manual deleted successfully",
    });
  } catch (error) {
    console.error("Delete Practical Manual Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete practical manual",
      error: error.message,
    });
  }
};

module.exports = {
  createPracticalManual,
  getPracticalManuals,
  getPracticalManualById,
  updatePracticalManual,
  deletePracticalManual,
};