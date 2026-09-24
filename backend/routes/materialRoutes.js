const express = require("express");

const {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

const router = express.Router();

// GET all materials
router.get("/", getMaterials);

// GET single material
router.get("/:id", getMaterialById);

// CREATE material
router.post("/", createMaterial);

// UPDATE material
router.put("/:id", updateMaterial);

// DELETE material
router.delete("/:id", deleteMaterial);

module.exports = router;