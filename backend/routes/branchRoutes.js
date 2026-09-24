const express = require("express");

const {
  createBranch,
  getBranches,
} = require("../controllers/branchController");

const router = express.Router();

// GET all branches
// Optional filter: /api/branches?courseId=COURSE_ID
router.get("/", getBranches);

// POST create branch
router.post("/", createBranch);

module.exports = router;