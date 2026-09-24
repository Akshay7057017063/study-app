
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import CourseForm from "./CourseForm";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/courseService";

import { getColleges } from "../../services/collegeService";
import { getFaculties } from "../../services/facultyService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [collegeFilter, setCollegeFilter] =
    useState("");
  const [facultyFilter, setFacultyFilter] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingCourse, setEditingCourse] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // --------------------------------------------------
  // Message
  // --------------------------------------------------

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    window.setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3500);
  };

  // --------------------------------------------------
  // Load Options
  // --------------------------------------------------

  const loadOptions = async () => {
    try {
      const [
        collegesResponse,
        facultiesResponse,
      ] = await Promise.all([
        getColleges(),
        getFaculties(),
      ]);

      setColleges(
        Array.isArray(collegesResponse?.data)
          ? collegesResponse.data
          : []
      );

      setFaculties(
        Array.isArray(facultiesResponse?.data)
          ? facultiesResponse.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Course Options Error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Load Courses
  // --------------------------------------------------

  const loadCourses = async () => {
    try {
      setLoading(true);

      const response = await getCourses();

      console.log(
        "COURSES RESPONSE:",
        response
      );

      setCourses(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Courses Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
    loadCourses();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getCollegeName = (collegeId) => {
    if (!collegeId) {
      return "-";
    }

    if (typeof collegeId === "object") {
      return (
        collegeId.name ||
        collegeId.code ||
        "-"
      );
    }

    const college = colleges.find(
      (item) => item._id === collegeId
    );

    return college?.name || "-";
  };

  const getFacultyName = (facultyId) => {
    if (!facultyId) {
      return "-";
    }

    if (typeof facultyId === "object") {
      return (
        facultyId.name ||
        facultyId.code ||
        "-"
      );
    }

    const faculty = faculties.find(
      (item) => item._id === facultyId
    );

    return faculty?.name || "-";
  };

  const getId = (value) => {
    if (!value) {
      return "";
    }

    if (typeof value === "object") {
      return value._id || "";
    }

    return value;
  };

  // --------------------------------------------------
  // Filter
  // --------------------------------------------------

  const filteredCourses = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return courses.filter((course) => {
      const collegeId = getId(
        course.collegeId
      );

      const facultyId = getId(
        course.facultyId
      );

      const matchesSearch =
        !query ||
        course.name
          ?.toLowerCase()
          .includes(query) ||
        course.shortName
          ?.toLowerCase()
          .includes(query);

      const matchesCollege =
        !collegeFilter ||
        collegeId === collegeFilter;

      const matchesFaculty =
        !facultyFilter ||
        facultyId === facultyFilter;

      return (
        matchesSearch &&
        matchesCollege &&
        matchesFaculty
      );
    });
  }, [
    courses,
    search,
    collegeFilter,
    facultyFilter,
    colleges,
    faculties,
  ]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  const handleCloseModal = () => {
    if (formLoading) {
      return;
    }

    setModalOpen(false);
    setEditingCourse(null);
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingCourse) {
        await updateCourse(
          editingCourse._id,
          formData
        );

        showMessage(
          "success",
          "Course updated successfully."
        );
      } else {
        await createCourse(formData);

        showMessage(
          "success",
          "Course created successfully."
        );
      }

      setModalOpen(false);
      setEditingCourse(null);

      await loadCourses();
    } catch (error) {
      console.error(
        "Save Course Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save course."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteClick = (course) => {
    setDeleteTarget(course);
  };

  const handleDeleteCancel = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteCourse(
        deleteTarget._id
      );

      showMessage(
        "success",
        "Course deleted successfully."
      );

      setDeleteTarget(null);

      await loadCourses();
    } catch (error) {
      console.error(
        "Delete Course Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to delete course."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // Columns
  // --------------------------------------------------

  const columns = [
    {
      key: "name",
      label: "Course",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {row.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {row.shortName || "Course"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "college",
      label: "College",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {getCollegeName(
            row.collegeId
          )}
        </span>
      ),
    },

    {
      key: "faculty",
      label: "Faculty",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {getFacultyName(
            row.facultyId
          )}
        </span>
      ),
    },

    {
      key: "duration",
      label: "Duration",
      render: (row) => (
        <span className="font-medium text-slate-700">
          {row.duration || "-"} Years
        </span>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      render: (row) =>
        row.isActive !== false ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            <X size={14} />
            Inactive
          </span>
        ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Edit course"
            onClick={() =>
              handleEdit(row)
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            title="Delete course"
            onClick={() =>
              handleDeleteClick(row)
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Courses"
        description="Manage academic courses associated with colleges and faculties."
        actionLabel="Add Course"
        onAction={handleAdd}
      />

      {/* Alert */}
      {message.text && (
        <div
          className={`
            flex
            items-start
            gap-3
            rounded-xl
            border
            px-4
            py-3
            ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }
          `}
        >
          {message.type === "success" ? (
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
          ) : (
            <X
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />
          )}

          <p className="flex-1 text-sm font-medium">
            {message.text}
          </p>

          <button
            type="button"
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
            className="rounded-lg p-1 hover:bg-white/70"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search course or short name..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* College Filter */}
          <select
            value={collegeFilter}
            onChange={(event) =>
              setCollegeFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">
              All Colleges
            </option>

            {colleges.map((college) => (
              <option
                key={college._id}
                value={college._id}
              >
                {college.name}
              </option>
            ))}
          </select>

          {/* Faculty Filter */}
          <select
            value={facultyFilter}
            onChange={(event) =>
              setFacultyFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">
              All Faculties
            </option>

            {faculties.map((faculty) => (
              <option
                key={faculty._id}
                value={faculty._id}
              >
                {faculty.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {filteredCourses.length}
          </span>{" "}
          {filteredCourses.length === 1
            ? "Course"
            : "Courses"}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCourses}
        loading={loading}
        emptyTitle={
          search ||
          collegeFilter ||
          facultyFilter
            ? "No courses found"
            : "No courses added yet"
        }
        emptyDescription={
          search ||
          collegeFilter ||
          facultyFilter
            ? "Try changing your search or filters."
            : "Add your first course to continue building the academic hierarchy."
        }
      />

      {/* Add / Edit */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          editingCourse
            ? "Edit Course"
            : "Add Course"
        }
        description={
          editingCourse
            ? "Update the course information below."
            : "Enter the details for the new academic course."
        }
        size="lg"
      >
        <CourseForm
          course={editingCourse}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={handleDeleteCancel}
        title="Delete Course"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Trash2 size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-red-900">
                  Are you sure you want to delete
                  this course?
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  <span className="font-semibold">
                    {deleteTarget?.name}
                  </span>{" "}
                  will be permanently removed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={handleDeleteCancel}
              disabled={deleteLoading}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              icon="delete"
              loading={deleteLoading}
              onClick={handleDeleteConfirm}
            >
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Courses;

