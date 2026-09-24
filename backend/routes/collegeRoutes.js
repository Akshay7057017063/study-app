const express = require("express");

const {
  createCollege,
  getColleges,
} = require("../controllers/collegeController");

const router = express.Router();

router.get("/", getColleges);

router.post("/", createCollege);

module.exports = router;