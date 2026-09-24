const express = require("express");

const {
  createPracticalManual,
  getPracticalManuals,
  getPracticalManualById,
  updatePracticalManual,
  deletePracticalManual,
} = require("../controllers/practicalManualController");

const router = express.Router();

// Get all practical manuals
router.get("/", getPracticalManuals);

// Get practical manual by ID
router.get("/:id", getPracticalManualById);

// Create practical manual
router.post("/", createPracticalManual);

// Update practical manual
router.put("/:id", updatePracticalManual);

// Delete practical manual
router.delete("/:id", deletePracticalManual);

module.exports = router;