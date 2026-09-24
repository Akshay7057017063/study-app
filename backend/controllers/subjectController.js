
const mongoose = require("mongoose");
const Subject = require("../models/Subject");

// Create Subject
const createSubject = async (req, res) => {
  try {
    const { branchId, semesterId, name, code } = req.body;

    if (!branchId || !semesterId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "Branch, semester, name and code are required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingSubject = await Subject.findOne({
      semesterId,
      code: normalizedCode,
    });

    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "Subject with this code already exists in this semester",
      });
    }

    const subject = await Subject.create({
      branchId,
      semesterId,
      name: name.trim(),
      code: normalizedCode,
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Create Subject Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

// Get Subjects
const getSubjects = async (req, res) => {
  try {
    const filter = {};

    if (req.query.branchId) {
      filter.branchId = req.query.branchId;
    }

    if (req.query.semesterId) {
      filter.semesterId = req.query.semesterId;
    }

    const subjects = await Subject.find(filter)
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("Get Subjects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

// Get Subject By ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const subject = await Subject.findById(id)
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Get Subject By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

// Update Subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchId, semesterId, name, code, isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    if (!branchId || !semesterId || !name || !code) {
      return res.status(400).json({
        success: false,
        message: "Branch, semester, name and code are required",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingSubject = await Subject.findOne({
      semesterId,
      code: normalizedCode,
      _id: { $ne: id },
    });

    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "Subject with this code already exists in this semester",
      });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        branchId,
        semesterId,
        name: name.trim(),
        code: normalizedCode,
        ...(isActive !== undefined ? { isActive } : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Update Subject Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};

