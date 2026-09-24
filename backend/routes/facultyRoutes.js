const express = require("express");

const {
  createFaculty,
  getFaculties,
} = require("../controllers/facultyController");

const router = express.Router();

router.get("/", getFaculties);
router.post("/", createFaculty);

module.exports = router;