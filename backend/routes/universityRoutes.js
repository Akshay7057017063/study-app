const express = require("express");

const {
  createUniversity,
  getUniversities,
} = require("../controllers/universityController");

const router = express.Router();

router.get("/", getUniversities);
router.post("/", createUniversity);

module.exports = router;
