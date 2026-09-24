const express = require("express");

const {
  createQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  updateQuestionPaper,
  deleteQuestionPaper,
} = require("../controllers/questionPaperController");

const router = express.Router();

router.get("/", getQuestionPapers);

router.get("/:id", getQuestionPaperById);

router.post("/", createQuestionPaper);

router.put("/:id", updateQuestionPaper);

router.delete("/:id", deleteQuestionPaper);

module.exports = router;