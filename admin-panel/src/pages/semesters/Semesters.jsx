
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
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

import SemesterForm from "./SemesterForm";

import {
  getSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../services/semesterService";

import { getBranches } from "../../services/branchService";

function Semesters() {
  const [semesters, setSemesters] =
    useState([]);

  const [branches, setBranches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [branchFilter, setBranchFilter] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingSemester, setEditingSemester] =
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
  // Load Branches
  // --------------------------------------------------

  const loadBranches = async () => {
    try {
      const response =
        await getBranches();

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
    }
  };

  // --------------------------------------------------
  // Load Semesters
  // --------------------------------------------------

  const loadSemesters = async () => {
    try {
      setLoading(true);

      const response =
        await getSemesters();

      console.log(
        "SEMESTERS RESPONSE:",
        response
      );

      setSemesters(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Semesters Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to load semesters."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    loadSemesters();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getBranchId = (branchId) => {
    if (!branchId) {
      return "";
    }

    if (typeof branchId === "object") {
      return branchId._id || "";
    }

    return branchId;
  };

  const getBranchName = (branchId) => {
    if (!branchId) {
      return "-";
    }

    if (typeof branchId === "object") {
      return (
        branchId.name ||
        branchId.code ||
        "-"
      );
    }

    const branch = branches.find(
      (item) => item._id === branchId
    );

    return branch?.name || "-";
  };

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredSemesters = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return semesters.filter(
      (semester) => {
        const semesterBranchId =
          getBranchId(
            semester.branchId
          );

        const semesterText =
          `semester ${
            semester.semesterNumber || ""
          }`;

        const academicYear =
          semester.academicYear || "";

        const matchesSearch =
          !query ||
          semesterText
            .toLowerCase()
            .includes(query) ||
          academicYear
            .toLowerCase()
            .includes(query) ||
          getBranchName(
            semester.branchId
          )
            .toLowerCase()
            .includes(query);

        const matchesBranch =
          !branchFilter ||
          semesterBranchId ===
            branchFilter;

        return (
          matchesSearch &&
          matchesBranch
        );
      }
    );
  }, [
    semesters,
    branches,
    search,
    branchFilter,
  ]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingSemester(null);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (semester) => {
    setEditingSemester(semester);
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
    setEditingSemester(null);
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingSemester) {
        await updateSemester(
          editingSemester._id,
          formData
        );

        showMessage(
          "success",
          "Semester updated successfully."
        );
      } else {
        await createSemester(formData);

        showMessage(
          "success",
          "Semester created successfully."
        );
      }

      setModalOpen(false);
      setEditingSemester(null);

      await loadSemesters();
    } catch (error) {
      console.error(
        "Save Semester Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save semester."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteClick = (semester) => {
    setDeleteTarget(semester);
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

      await deleteSemester(
        deleteTarget._id
      );

      showMessage(
        "success",
        "Semester deleted successfully."
      );

      setDeleteTarget(null);

      await loadSemesters();
    } catch (error) {
      console.error(
        "Delete Semester Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to delete semester."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // Table Columns
  // --------------------------------------------------

  const columns = [
    {
      key: "semesterNumber",
      label: "Semester",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Semester{" "}
              {row.semesterNumber}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Academic Semester
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "branch",
      label: "Branch",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700">
          {getBranchName(
            row.branchId
          )}
        </span>
      ),
    },

    {
      key: "academicYear",
      label: "Academic Year",
      render: (row) => (
        <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {row.academicYear || "-"}
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
            title="Edit semester"
            onClick={() =>
              handleEdit(row)
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            title="Delete semester"
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
        title="Semesters"
        description="Manage academic semesters for each branch and academic year."
        actionLabel="Add Semester"
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
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search semester, branch or academic year..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(event) =>
              setBranchFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">
              All Branches
            </option>

            {branches.map((branch) => (
              <option
                key={branch._id}
                value={branch._id}
              >
                {branch.name}
                {branch.code
                  ? ` (${branch.code})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {filteredSemesters.length}
          </span>{" "}
          {filteredSemesters.length === 1
            ? "Semester"
            : "Semesters"}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSemesters}
        loading={loading}
        emptyTitle={
          search || branchFilter
            ? "No semesters found"
            : "No semesters added yet"
        }
        emptyDescription={
          search || branchFilter
            ? "Try changing your search or filter."
            : "Add your first semester to continue building the academic hierarchy."
        }
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          editingSemester
            ? "Edit Semester"
            : "Add Semester"
        }
        description={
          editingSemester
            ? "Update the semester information below."
            : "Enter the details for the new semester."
        }
        size="md"
      >
        <SemesterForm
          semester={editingSemester}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={handleDeleteCancel}
        title="Delete Semester"
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
                  Are you sure you want to
                  delete this semester?
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Semester{" "}
                  <span className="font-semibold">
                    {
                      deleteTarget?.semesterNumber
                    }
                  </span>{" "}
                  (
                  {
                    deleteTarget?.academicYear
                  }
                  ) will be permanently
                  removed.
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
              Delete Semester
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Semesters;

