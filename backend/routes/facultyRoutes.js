const express = require("express");

const {
  createFaculty,
  getFaculties,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const router = express.Router();

router.get("/", getFaculties);
router.post("/", createFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

module.exports = router;
