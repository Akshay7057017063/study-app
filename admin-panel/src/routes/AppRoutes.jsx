
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";
import Universities from "../pages/universities/Universities";
import Colleges from "../pages/colleges/Colleges";
import Faculties from "../pages/faculties/Faculties";
import Courses from "../pages/courses/Courses";
import Branches from "../pages/branches/Branches";
import Semesters from "../pages/semesters/Semesters";
import Subjects from "../pages/subjects/Subjects";
import Materials from "../pages/materials/Materials";
import QuestionPapers from "../pages/question-papers/QuestionPapers";
import PracticalManuals from "../pages/practical-manuals/PracticalManuals";
import Syllabus from "../pages/syllabus/Syllabus";
import Profile from "../pages/profile/Profile";

import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            DASHBOARD
        ========================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        {/* =========================
            UNIVERSITIES
        ========================== */}
        <Route
          path="/universities"
          element={
            <ProtectedPage>
              <Universities />
            </ProtectedPage>
          }
        />

        {/* =========================
            COLLEGES
        ========================== */}
        <Route
          path="/colleges"
          element={
            <ProtectedPage>
              <Colleges />
            </ProtectedPage>
          }
        />

        {/* =========================
            FACULTIES
        ========================== */}
        <Route
          path="/faculties"
          element={
            <ProtectedPage>
              <Faculties />
            </ProtectedPage>
          }
        />

        {/* =========================
            COURSES
        ========================== */}
        <Route
          path="/courses"
          element={
            <ProtectedPage>
              <Courses />
            </ProtectedPage>
          }
        />

        {/* =========================
            BRANCHES
        ========================== */}
        <Route
          path="/branches"
          element={
            <ProtectedPage>
              <Branches />
            </ProtectedPage>
          }
        />

        {/* =========================
            SEMESTERS
        ========================== */}
        <Route
          path="/semesters"
          element={
            <ProtectedPage>
              <Semesters />
            </ProtectedPage>
          }
        />

        {/* =========================
            SUBJECTS
        ========================== */}
        <Route
          path="/subjects"
          element={
            <ProtectedPage>
              <Subjects />
            </ProtectedPage>
          }
        />

        {/* =========================
            STUDY MATERIALS
        ========================== */}
        <Route
          path="/materials"
          element={
            <ProtectedPage>
              <Materials />
            </ProtectedPage>
          }
        />

        {/* =========================
            QUESTION PAPERS
        ========================== */}
        <Route
          path="/question-papers"
          element={
            <ProtectedPage>
              <QuestionPapers />
            </ProtectedPage>
          }
        />

        {/* =========================
            PRACTICAL MANUALS
        ========================== */}
        <Route
          path="/practical-manuals"
          element={
            <ProtectedPage>
              <PracticalManuals />
            </ProtectedPage>
          }
        />
        <Route
  path="/syllabus"
  element={
    <ProtectedPage>
      <Syllabus />
    </ProtectedPage>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedPage>
      <Profile />
    </ProtectedPage>
  }
/>
        {/* =========================
            DEFAULT
        ========================== */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =========================
            UNKNOWN ROUTE
        ========================== */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
