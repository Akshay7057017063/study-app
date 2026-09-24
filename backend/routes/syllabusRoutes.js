const express = require("express");

const {
  createSyllabus,
  getSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus,
} = require("../controllers/syllabusController");

const router = express.Router();

router.get("/", getSyllabus);

router.get("/:id", getSyllabusById);

router.post("/", createSyllabus);

router.put("/:id", updateSyllabus);

router.delete("/:id", deleteSyllabus);

module.exports = router;