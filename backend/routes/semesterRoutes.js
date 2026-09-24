const express = require("express");

const {
  createSemester,
  getSemesters,
} = require("../controllers/semesterController");

const router = express.Router();

// GET semesters
// /api/semesters
// /api/semesters?branchId=xxx
router.get("/", getSemesters);

// POST semester
router.post("/", createSemester);

module.exports = router;