require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const universityRoutes = require("./routes/universityRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const courseRoutes = require("./routes/courseRoutes");
const branchRoutes = require("./routes/branchRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const materialRoutes = require("./routes/materialRoutes");
const questionPaperRoutes = require("./routes/questionPaperRoutes");
const practicalManualRoutes = require("./routes/practicalManualRoutes");
const syllabusRoutes = require("./routes/syllabusRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==========================================
// MongoDB Connection
// ==========================================

connectDB();

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
  "https://study-app-1-wsac.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// Body Parser
// ==========================================

app.use(express.json());

// ==========================================
// Request Logger
// ==========================================

app.use((req, res, next) => {
  console.log(
    "REQUEST:",
    req.method,
    req.originalUrl
  );

  next();
});

// ==========================================
// API Routes
// ==========================================

app.use(
  "/api/universities",
  universityRoutes
);

app.use(
  "/api/colleges",
  collegeRoutes
);

app.use(
  "/api/faculties",
  facultyRoutes
);

app.use(
  "/api/courses",
  courseRoutes
);

app.use(
  "/api/branches",
  branchRoutes
);

app.use(
  "/api/semesters",
  semesterRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);

app.use(
  "/api/materials",
  materialRoutes
);

app.use(
  "/api/question-papers",
  questionPaperRoutes
);

app.use(
  "/api/practical-manuals",
  practicalManualRoutes
);

app.use(
  "/api/syllabus",
  syllabusRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ==========================================
// Home Route
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyHub Backend API is running",
  });
});

// ==========================================
// Health Check
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StudyHub API is healthy",
  });
});

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  if (err.message && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `StudyHub Backend running on port ${PORT}`
  );
});