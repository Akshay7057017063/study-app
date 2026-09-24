
import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import SubjectForm from "./SubjectForm";

import {
  deleteSubject,
  getSubjects,
} from "../../services/subjectService";

import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!branchFilter) {
      loadSemesters("");
      return;
    }

    loadSemesters(branchFilter);
    setSemesterFilter("");
  }, [branchFilter]);

  useEffect(() => {
    loadSubjects();
  }, [branchFilter, semesterFilter]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectResponse, branchResponse] =
        await Promise.all([
          getSubjects(),
          getBranches(),
        ]);

      setSubjects(subjectResponse?.data || []);
      setBranches(branchResponse?.data || []);

      if (branchResponse?.data?.length > 0) {
        // Semesters are loaded after selecting a branch.
        setSemesters([]);
      }
    } catch (err) {
      console.error("Load Subjects Error:", err);
      setError(err.message || "Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setError("");

      const response = await getSubjects(
        branchFilter,
        semesterFilter
      );

      setSubjects(response?.data || []);
    } catch (err) {
      console.error("Load Subjects Error:", err);
      setError(err.message || "Failed to load subjects.");
    }
  };

  const loadSemesters = async (branchId) => {
    if (!branchId) {
      setSemesters([]);
      return;
    }

    try {
      setLoadingSemesters(true);

      const response = await getSemesters(branchId);

      setSemesters(response?.data || []);
    } catch (err) {
      console.error("Load Semesters Error:", err);
      setSemesters([]);
      setError(err.message || "Failed to load semesters.");
    } finally {
      setLoadingSemesters(false);
    }
  };

  const filteredSubjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return subjects;
    }

    return subjects.filter((subject) => {
      const branchName =
        typeof subject.branchId === "object"
          ? subject.branchId?.name
          : "";

      const branchCode =
        typeof subject.branchId === "object"
          ? subject.branchId?.code
          : "";

      const semesterNumber =
        typeof subject.semesterId === "object"
          ? subject.semesterId?.semesterNumber
          : "";

      return [
        subject.name,
        subject.code,
        branchName,
        branchCode,
        semesterNumber,
      ]
        .filter(Boolean)
        .some((item) =>
          String(item)
            .toLowerCase()
            .includes(value)
        );
    });
  }, [subjects, search]);

  const openCreateModal = () => {
    setEditingSubject(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSubject(null);
  };

  const handleFormSuccess = async () => {
    closeModal();

    setSuccess(
      editingSubject
        ? "Subject updated successfully."
        : "Subject created successfully."
    );

    await loadSubjects();
  };

  const handleDelete = async (subject) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSubject(subject._id);

      setSuccess("Subject deleted successfully.");

      await loadSubjects();
    } catch (err) {
      console.error("Delete Subject Error:", err);
      setError(err.message || "Failed to delete subject.");
    }
  };

  const getBranchName = (subject) => {
    if (
      subject.branchId &&
      typeof subject.branchId === "object"
    ) {
      return subject.branchId.name || "-";
    }

    return "-";
  };

  const getBranchCode = (subject) => {
    if (
      subject.branchId &&
      typeof subject.branchId === "object"
    ) {
      return subject.branchId.code || "";
    }

    return "";
  };

  const getSemester = (subject) => {
    if (
      subject.semesterId &&
      typeof subject.semesterId === "object"
    ) {
      const number = subject.semesterId.semesterNumber;
      const year = subject.semesterId.academicYear;

      return `Semester ${number}${year ? ` • ${year}` : ""}`;
    }

    return "-";
  };

  const columns = [
    {
      key: "name",
      label: "Subject",
      render: (subject) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-slate-900">
            {subject.name}
          </p>

          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-blue-600">
            {subject.code}
          </p>
        </div>
      ),
    },
    {
      key: "branch",
      label: "Branch",
      render: (subject) => (
        <div>
          <p className="font-medium text-slate-800">
            {getBranchName(subject)}
          </p>

          {getBranchCode(subject) && (
            <p className="mt-0.5 text-xs text-slate-500">
              {getBranchCode(subject)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "semester",
      label: "Semester",
      render: (subject) => (
        <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {getSemester(subject)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (subject) => (
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              subject.isActive !== false
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {subject.isActive !== false
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (subject) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(subject)}
            aria-label={`Edit ${subject.name}`}
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              p-2
              text-slate-600
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
              focus:outline-none
              focus:ring-4
              focus:ring-blue-500/10
            "
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => handleDelete(subject)}
            aria-label={`Delete ${subject.name}`}
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              p-2
              text-slate-600
              transition
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus:outline-none
              focus:ring-4
              focus:ring-red-500/10
            "
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Subjects"
        description="Manage subjects linked with branches and semesters."
        actionLabel="Add Subject"
        onAction={openCreateModal}
      />

      {/* Alerts */}
      {(success || error) && (
        <div className="mb-5">
          {success && (
            <div className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <span>{success}</span>

              <button
                type="button"
                onClick={() => setSuccess("")}
                aria-label="Close success message"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Close error message"
              >
                <X size={17} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_240px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects, codes or branches..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>

          {/* Branch */}
          <select
            value={branchFilter}
            onChange={(e) =>
              setBranchFilter(e.target.value)
            }
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          >
            <option value="">All Branches</option>

            {branches.map((branch) => (
              <option
                key={branch._id}
                value={branch._id}
              >
                {branch.name}
              </option>
            ))}
          </select>

          {/* Semester */}
          <select
            value={semesterFilter}
            onChange={(e) =>
              setSemesterFilter(e.target.value)
            }
            disabled={!branchFilter || loadingSemesters}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          >
            <option value="">
              {!branchFilter
                ? "Select branch for semester"
                : loadingSemesters
                  ? "Loading semesters..."
                  : "All Semesters"}
            </option>

            {semesters.map((semester) => (
              <option
                key={semester._id}
                value={semester._id}
              >
                Semester {semester.semesterNumber} —{" "}
                {semester.academicYear}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSubjects}
        loading={loading}
        emptyTitle="No subjects found"
        emptyDescription="Create your first subject or change the filters."
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingSubject
            ? "Edit Subject"
            : "Add Subject"
        }
        description={
          editingSubject
            ? "Update the subject details."
            : "Add a new subject to a branch and semester."
        }
        size="lg"
      >
        <SubjectForm
          subject={editingSubject}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default Subjects;

