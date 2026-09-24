
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import PracticalManualForm from "./PracticalManualForm";

import {
  getPracticalManuals,
  deletePracticalManual,
} from "../../services/practicalManualService";

import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

function PracticalManuals() {
  const [manuals, setManuals] = useState([]);

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [published, setPublished] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingManual, setEditingManual] = useState(null);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getId = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      return value._id || value.id || "";
    }
    return value;
  };

  const getName = (value, fallback = "—") => {
    if (!value) return fallback;

    if (typeof value === "object") {
      return value.name || value.title || fallback;
    }

    return value;
  };

  const getResponseData = (response) => {
    return response?.data || response || [];
  };

  // --------------------------------------------------
  // Load manuals
  // --------------------------------------------------

  const loadManuals = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};

      if (branchId) filters.branchId = branchId;
      if (semesterId) filters.semesterId = semesterId;
      if (subjectId) filters.subjectId = subjectId;
      if (type) filters.type = type;
      if (year) filters.year = year;

      if (published !== "") {
        filters.published = published;
      }

      const response =
        await getPracticalManuals(filters);

      setManuals(getResponseData(response));
    } catch (err) {
      setError(
        err.message ||
          "Failed to load practical manuals"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load branches
  // --------------------------------------------------

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await getBranches();

        setBranches(getResponseData(response));
      } catch (err) {
        setError(
          err.message ||
            "Failed to load branches"
        );
      }
    };

    loadBranches();
  }, []);

  // --------------------------------------------------
  // Load manuals when filters change
  // --------------------------------------------------

  useEffect(() => {
    loadManuals();
  }, [
    branchId,
    semesterId,
    subjectId,
    type,
    year,
    published,
  ]);

  // --------------------------------------------------
  // Branch → Semester
  // --------------------------------------------------

  useEffect(() => {
    const loadSemesters = async () => {
      setSemesterId("");
      setSubjectId("");
      setSemesters([]);
      setSubjects([]);

      if (!branchId) return;

      try {
        const response =
          await getSemesters(branchId);

        setSemesters(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load semesters"
        );
      }
    };

    loadSemesters();
  }, [branchId]);

  // --------------------------------------------------
  // Semester → Subject
  // --------------------------------------------------

  useEffect(() => {
    const loadSubjects = async () => {
      setSubjectId("");
      setSubjects([]);

      if (!branchId || !semesterId) return;

      try {
        const response = await getSubjects(
          branchId,
          semesterId
        );

        setSubjects(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load subjects"
        );
      }
    };

    loadSubjects();
  }, [branchId, semesterId]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredManuals = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) return manuals;

    return manuals.filter((manual) => {
      const title =
        manual.title?.toLowerCase() || "";

      const description =
        manual.description?.toLowerCase() || "";

      const fileName =
        manual.fileName?.toLowerCase() || "";

      const subjectName = getName(
        manual.subjectId,
        ""
      ).toLowerCase();

      return (
        title.includes(searchText) ||
        description.includes(searchText) ||
        fileName.includes(searchText) ||
        subjectName.includes(searchText)
      );
    });
  }, [manuals, search]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingManual(null);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (manual) => {
    setEditingManual(manual);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (manual) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${manual.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deletePracticalManual(
        manual._id
      );

      await loadManuals();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete practical manual"
      );
    }
  };

  // --------------------------------------------------
  // Form success
  // --------------------------------------------------

  const handleFormSuccess = async () => {
    setShowModal(false);
    setEditingManual(null);
    await loadManuals();
  };

  // --------------------------------------------------
  // Table columns
  // --------------------------------------------------

  const columns = [
    {
      header: "Practical Manual",
      key: "manual",
      render: (manual) => (
        <div className="flex min-w-60 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">
              {manual.title || "Untitled Manual"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {manual.fileName || "No file name"}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Subject",
      key: "subject",
      render: (manual) => (
        <div>
          <p className="font-medium text-slate-700">
            {getName(manual.subjectId)}
          </p>

          {manual.subjectId?.code && (
            <p className="mt-1 text-xs text-slate-500">
              {manual.subjectId.code}
            </p>
          )}
        </div>
      ),
    },

    {
      header: "Academic",
      key: "academic",
      render: (manual) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {manual.academicYear || "—"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {getName(manual.branchId)}
          </p>
        </div>
      ),
    },

    {
      header: "Type",
      key: "type",
      render: (manual) => (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
          {manual.type || "Practical"}
        </span>
      ),
    },

    {
      header: "Status",
      key: "status",
      render: (manual) =>
        manual.isPublished ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Published
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Draft
          </span>
        ),
    },

    {
      header: "Actions",
      key: "actions",
      render: (manual) => (
        <div className="flex items-center gap-1">
          {manual.fileUrl && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  manual.fileUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              title="Open manual"
              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
            >
              <ExternalLink size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleEdit(manual)}
            title="Edit manual"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleDelete(manual)
            }
            title="Delete manual"
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Practical Manuals"
        description="Manage practical manuals and lab resources for students."
        action={
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Practical Manual
          </button>
        }
      />

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-7">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search manuals..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Branch */}
          <select
            value={branchId}
            onChange={(event) =>
              setBranchId(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              </option>
            ))}
          </select>

          {/* Semester */}
          <select
            value={semesterId}
            onChange={(event) =>
              setSemesterId(event.target.value)
            }
            disabled={!branchId}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Semesters
            </option>

            {semesters.map((semester) => (
              <option
                key={semester._id}
                value={semester._id}
              >
                Semester {semester.semesterNumber}
              </option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={subjectId}
            onChange={(event) =>
              setSubjectId(event.target.value)
            }
            disabled={!semesterId}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Subjects
            </option>

            {subjects.map((subject) => (
              <option
                key={subject._id}
                value={subject._id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Types
            </option>
            <option value="practical">
              Practical
            </option>
            <option value="manual">
              Manual
            </option>
            <option value="lab">
              Lab Manual
            </option>
            <option value="other">
              Other
            </option>
          </select>

          {/* Year */}
          <input
            type="text"
            value={year}
            onChange={(event) =>
              setYear(event.target.value)
            }
            placeholder="Academic year"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Published */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Status:
          </span>

          <button
            type="button"
            onClick={() => setPublished("")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              published === ""
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setPublished("true")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              published === "true"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Published
          </button>

          <button
            type="button"
            onClick={() => setPublished("false")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              published === "false"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Draft
          </button>

          {(search ||
            branchId ||
            semesterId ||
            subjectId ||
            type ||
            year ||
            published !== "") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBranchId("");
                setSemesterId("");
                setSubjectId("");
                setType("");
                setYear("");
                setPublished("");
              }}
              className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FileText size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {filteredManuals.length} Practical Manual
            {filteredManuals.length !== 1
              ? "s"
              : ""}
          </p>

          <p className="text-xs text-slate-500">
            Available in the current view
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredManuals}
        loading={loading}
        emptyMessage="No practical manuals found."
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          if (!loading) {
            setShowModal(false);
            setEditingManual(null);
          }
        }}
        title={
          editingManual
            ? "Edit Practical Manual"
            : "Add Practical Manual"
        }
        size="xl"
      >
        <PracticalManualForm
          manual={editingManual}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowModal(false);
            setEditingManual(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default PracticalManuals;
