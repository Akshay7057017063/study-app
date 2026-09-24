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

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// API Routes
app.use("/api/universities", universityRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/practical-manuals", practicalManualRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/admin", adminRoutes);


// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyHub Backend API is running",
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StudyHub API is healthy",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});