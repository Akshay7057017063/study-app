
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  GitBranch,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import BranchForm from "./BranchForm";

import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../services/branchService";

import { getCourses } from "../../services/courseService";

function Branches() {
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingBranch, setEditingBranch] =
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
  // Load Courses
  // --------------------------------------------------

  const loadCourses = async () => {
    try {
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
    }
  };

  // --------------------------------------------------
  // Load Branches
  // --------------------------------------------------

  const loadBranches = async () => {
    try {
      setLoading(true);

      const response = await getBranches();

      console.log(
        "BRANCHES RESPONSE:",
        response
      );

      setBranches(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Branches Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to load branches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadBranches();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getCourseId = (courseId) => {
    if (!courseId) {
      return "";
    }

    if (typeof courseId === "object") {
      return courseId._id || "";
    }

    return courseId;
  };

  const getCourseName = (courseId) => {
    if (!courseId) {
      return "-";
    }

    if (typeof courseId === "object") {
      return (
        courseId.name ||
        courseId.shortName ||
        "-"
      );
    }

    const course = courses.find(
      (item) => item._id === courseId
    );

    return course?.name || "-";
  };

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredBranches = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return branches.filter((branch) => {
      const branchCourseId =
        getCourseId(branch.courseId);

      const matchesSearch =
        !query ||
        branch.name
          ?.toLowerCase()
          .includes(query) ||
        branch.code
          ?.toLowerCase()
          .includes(query);

      const matchesCourse =
        !courseFilter ||
        branchCourseId === courseFilter;

      return (
        matchesSearch &&
        matchesCourse
      );
    });
  }, [
    branches,
    courses,
    search,
    courseFilter,
  ]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingBranch(null);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Close Modal
  // --------------------------------------------------

  const handleCloseModal = () => {
    if (formLoading) {
      return;
    }

    setModalOpen(false);
    setEditingBranch(null);
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingBranch) {
        await updateBranch(
          editingBranch._id,
          formData
        );

        showMessage(
          "success",
          "Branch updated successfully."
        );
      } else {
        await createBranch(formData);

        showMessage(
          "success",
          "Branch created successfully."
        );
      }

      setModalOpen(false);
      setEditingBranch(null);

      await loadBranches();
    } catch (error) {
      console.error(
        "Save Branch Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save branch."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteClick = (branch) => {
    setDeleteTarget(branch);
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

      await deleteBranch(
        deleteTarget._id
      );

      showMessage(
        "success",
        "Branch deleted successfully."
      );

      setDeleteTarget(null);

      await loadBranches();
    } catch (error) {
      console.error(
        "Delete Branch Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to delete branch."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // Table
  // --------------------------------------------------

  const columns = [
    {
      key: "name",
      label: "Branch",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <GitBranch size={18} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {row.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Branch
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "code",
      label: "Code",
      render: (row) => (
        <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {row.code || "-"}
        </span>
      ),
    },

    {
      key: "course",
      label: "Course",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {getCourseName(row.courseId)}
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
            title="Edit branch"
            onClick={() =>
              handleEdit(row)
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            title="Delete branch"
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
        title="Branches"
        description="Manage branches under each academic course."
        actionLabel="Add Branch"
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
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
              placeholder="Search branch or code..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(event) =>
              setCourseFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">
              All Courses
            </option>

            {courses.map((course) => (
              <option
                key={course._id}
                value={course._id}
              >
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {filteredBranches.length}
          </span>{" "}
          {filteredBranches.length === 1
            ? "Branch"
            : "Branches"}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredBranches}
        loading={loading}
        emptyTitle={
          search || courseFilter
            ? "No branches found"
            : "No branches added yet"
        }
        emptyDescription={
          search || courseFilter
            ? "Try changing your search or filter."
            : "Add your first branch to continue building the academic hierarchy."
        }
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          editingBranch
            ? "Edit Branch"
            : "Add Branch"
        }
        description={
          editingBranch
            ? "Update the branch information below."
            : "Enter the details for the new branch."
        }
        size="md"
      >
        <BranchForm
          branch={editingBranch}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={handleDeleteCancel}
        title="Delete Branch"
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
                  this branch?
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
              Delete Branch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Branches;

