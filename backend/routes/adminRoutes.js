const express = require("express");

const {
  createAdmin,
  loginAdmin,
} = require("../controllers/adminController");

const router = express.Router();

// Create Admin
router.post("/", createAdmin);

// Admin Login
router.post("/login", loginAdmin);

module.exports = router;