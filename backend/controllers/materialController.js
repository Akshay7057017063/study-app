const Material = require("../models/Material");

// Create Material
const createMaterial = async (req, res) => {
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
      type,
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
      !fileUrl ||
      !fileName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "University, college, faculty, course, branch, semester, subject, title, fileUrl and fileName are required",
      });
    }

    const existingMaterial = await Material.findOne({
      subjectId,
      title: title.trim(),
    });

    if (existingMaterial) {
      return res.status(409).json({
        success: false,
        message:
          "Material with this title already exists for this subject",
      });
    }

    const material = await Material.create({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
      title: title.trim(),
      description: description || "",
      type: type || "notes",
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim(),
      isPublished:
        isPublished !== undefined ? isPublished : true,
    });

    return res.status(201).json({
      success: true,
      message: "Study material created successfully",
      data: material,
    });
  } catch (error) {
    console.error("Create Material Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create study material",
      error: error.message,
    });
  }
};

// Get Materials
const getMaterials = async (req, res) => {
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

    if (req.query.published === "true") {
      filter.isPublished = true;
    }

    if (req.query.published === "false") {
      filter.isPublished = false;
    }

    const materials = await Material.find(filter)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    console.error("Get Materials Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study materials",
      error: error.message,
    });
  }
};

// Get Single Material
const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("universityId", "name shortName code")
      .populate("collegeId", "name code city")
      .populate("facultyId", "name code")
      .populate("courseId", "name shortName duration")
      .populate("branchId", "name code")
      .populate("semesterId", "semesterNumber academicYear")
      .populate("subjectId", "name code");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error("Get Material By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study material",
      error: error.message,
    });
  }
};

// Update Material
const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    const {
      title,
      description,
      type,
      fileUrl,
      fileName,
      isPublished,
    } = req.body;

    if (title !== undefined) {
      material.title = title.trim();
    }

    if (description !== undefined) {
      material.description = description;
    }

    if (type !== undefined) {
      material.type = type;
    }

    if (fileUrl !== undefined) {
      material.fileUrl = fileUrl.trim();
    }

    if (fileName !== undefined) {
      material.fileName = fileName.trim();
    }

    if (isPublished !== undefined) {
      material.isPublished = isPublished;
    }

    await material.save();

    return res.status(200).json({
      success: true,
      message: "Study material updated successfully",
      data: material,
    });
  } catch (error) {
    console.error("Update Material Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update study material",
      error: error.message,
    });
  }
};

// Delete Material
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    await material.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Study material deleted successfully",
    });
  } catch (error) {
    console.error("Delete Material Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete study material",
      error: error.message,
    });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};