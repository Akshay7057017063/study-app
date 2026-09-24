const QuestionPaper = require("../models/QuestionPaper");

// Create Question Paper
const createQuestionPaper = async (req, res) => {
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
      examType,
      year,
      fileUrl,
      fileName,
      isPublished,
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
      !year ||
      !fileUrl ||
      !fileName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "University, college, faculty, course, branch, semester, subject, title, year, fileUrl and fileName are required",
      });
    }

    const existingQuestionPaper = await QuestionPaper.findOne({
      subjectId,
      title: title.trim(),
      year,
    });

    if (existingQuestionPaper) {
      return res.status(409).json({
        success: false,
        message:
          "Question paper with this title and year already exists for this subject",
      });
    }

    const questionPaper = await QuestionPaper.create({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
      title: title.trim(),
      examType: examType || "university",
      year,
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim(),
      isPublished:
        isPublished !== undefined ? isPublished : true,
    });

    return res.status(201).json({
      success: true,
      message: "Question paper created successfully",
      data: questionPaper,
    });
  } catch (error) {
    console.error("Create Question Paper Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question paper",
      error: error.message,
    });
  }
};

// Get Question Papers
const getQuestionPapers = async (req, res) => {
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

    if (req.query.examType) {
      filter.examType = req.query.examType;
    }

    if (req.query.year) {
      filter.year = Number(req.query.year);
    }

    if (req.query.published === "true") {
      filter.isPublished = true;
    }

    if (req.query.published === "false") {
      filter.isPublished = false;
    }

    const questionPapers = await QuestionPaper.find(filter)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code")
      .sort({ year: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questionPapers.length,
      data: questionPapers,
    });
  } catch (error) {
    console.error("Get Question Papers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question papers",
      error: error.message,
    });
  }
};

// Get Single Question Paper
const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code");

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: questionPaper,
    });
  } catch (error) {
    console.error("Get Question Paper By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question paper",
      error: error.message,
    });
  }
};

// Update Question Paper
const updateQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    const {
      title,
      examType,
      year,
      fileUrl,
      fileName,
      isPublished,
    } = req.body;

    if (title !== undefined) {
      questionPaper.title = title.trim();
    }

    if (examType !== undefined) {
      questionPaper.examType = examType;
    }

    if (year !== undefined) {
      questionPaper.year = year;
    }

    if (fileUrl !== undefined) {
      questionPaper.fileUrl = fileUrl.trim();
    }

    if (fileName !== undefined) {
      questionPaper.fileName = fileName.trim();
    }

    if (isPublished !== undefined) {
      questionPaper.isPublished = isPublished;
    }

    await questionPaper.save();

    return res.status(200).json({
      success: true,
      message: "Question paper updated successfully",
      data: questionPaper,
    });
  } catch (error) {
    console.error("Update Question Paper Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update question paper",
      error: error.message,
    });
  }
};

// Delete Question Paper
const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    await questionPaper.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    console.error("Delete Question Paper Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete question paper",
      error: error.message,
    });
  }
};

// IMPORTANT: Route imports must match these names exactly
module.exports = {
  createQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  updateQuestionPaper,
  deleteQuestionPaper,
};