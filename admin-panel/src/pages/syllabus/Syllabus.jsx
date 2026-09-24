
import { useEffect, useMemo, useState } from "react";
import {
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
import SyllabusForm from "./SyllabusForm";

import {
  getSyllabus,
  deleteSyllabus,
} from "../../services/syllabusService";

import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

function Syllabus() {
  const [syllabus, setSyllabus] = useState([]);

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [year, setYear] = useState("");
  const [published, setPublished] =
    useState("");

  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);
  const [editingSyllabus, setEditingSyllabus] =
    useState(null);

  // -----------------------------------------
  // Helpers
  // -----------------------------------------

  const getName = (
    value,
    fallback = "—"
  ) => {
    if (!value) return fallback;

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        fallback
      );
    }

    return value;
  };

  const getResponseData = (
    response
  ) => {
    return (
      response?.data ||
      response ||
      []
    );
  };

  // -----------------------------------------
  // Load syllabus
  // -----------------------------------------

  const loadSyllabus = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};

      if (branchId) {
        filters.branchId = branchId;
      }

      if (semesterId) {
        filters.semesterId =
          semesterId;
      }

      if (subjectId) {
        filters.subjectId =
          subjectId;
      }

      if (year) {
        filters.academicYear =
          year;
      }

      if (published !== "") {
        filters.published =
          published;
      }

      const response =
        await getSyllabus(filters);

      setSyllabus(
        getResponseData(response)
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load syllabus"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Branches
  // -----------------------------------------

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response =
          await getBranches();

        setBranches(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load branches"
        );
      }
    };

    loadBranches();
  }, []);

  // -----------------------------------------
  // Reload when filters change
  // -----------------------------------------

  useEffect(() => {
    loadSyllabus();
  }, [
    branchId,
    semesterId,
    subjectId,
    year,
    published,
  ]);

  // -----------------------------------------
  // Branch → Semester
  // -----------------------------------------

  useEffect(() => {
    const loadSemesters = async () => {
      setSemesterId("");
      setSubjectId("");
      setSemesters([]);
      setSubjects([]);

      if (!branchId) return;

      try {
        const response =
          await getSemesters(
            branchId
          );

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

  // -----------------------------------------
  // Semester → Subject
  // -----------------------------------------

  useEffect(() => {
    const loadSubjects = async () => {
      setSubjectId("");
      setSubjects([]);

      if (
        !branchId ||
        !semesterId
      ) {
        return;
      }

      try {
        const response =
          await getSubjects(
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
  }, [
    branchId,
    semesterId,
  ]);

  // -----------------------------------------
  // Search
  // -----------------------------------------

  const filteredSyllabus =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      if (!searchText) {
        return syllabus;
      }

      return syllabus.filter(
        (item) => {
          const title =
            item.title?.toLowerCase() ||
            "";

          const description =
            item.description?.toLowerCase() ||
            "";

          const fileName =
            item.fileName?.toLowerCase() ||
            "";

          const subjectName =
            getName(
              item.subjectId,
              ""
            ).toLowerCase();

          return (
            title.includes(
              searchText
            ) ||
            description.includes(
              searchText
            ) ||
            fileName.includes(
              searchText
            ) ||
            subjectName.includes(
              searchText
            )
          );
        }
      );
    }, [
      syllabus,
      search,
    ]);

  // -----------------------------------------
  // Add
  // -----------------------------------------

  const handleAdd = () => {
    setEditingSyllabus(null);
    setShowModal(true);
  };

  // -----------------------------------------
  // Edit
  // -----------------------------------------

  const handleEdit = (item) => {
    setEditingSyllabus(item);
    setShowModal(true);
  };

  // -----------------------------------------
  // Delete
  // -----------------------------------------

  const handleDelete = async (
    item
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.title}"?`
      );

    if (!confirmed) return;

    try {
      setError("");

      await deleteSyllabus(
        item._id
      );

      await loadSyllabus();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete syllabus"
      );
    }
  };

  // -----------------------------------------
  // Form success
  // -----------------------------------------

  const handleFormSuccess =
    async () => {
      setShowModal(false);
      setEditingSyllabus(null);

      await loadSyllabus();
    };

  // -----------------------------------------
  // Table
  // -----------------------------------------

  const columns = [
    {
      header: "Syllabus",
      key: "syllabus",
      render: (item) => (
        <div className="flex min-w-60 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">
              {item.title ||
                "Untitled Syllabus"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {item.fileName ||
                "No file name"}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Subject",
      key: "subject",
      render: (item) => (
        <div>
          <p className="font-medium text-slate-700">
            {getName(
              item.subjectId
            )}
          </p>

          {item.subjectId
            ?.code && (
            <p className="mt-1 text-xs text-slate-500">
              {
                item.subjectId
                  .code
              }
            </p>
          )}
        </div>
      ),
    },

    {
      header: "Academic",
      key: "academic",
      render: (item) => (
        <div>
          <p className="text-sm font-medium text-slate-700">
            {item.academicYear ||
              "—"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {getName(
              item.branchId
            )}
          </p>
        </div>
      ),
    },

    {
      header: "Status",
      key: "status",
      render: (item) =>
        item.isPublished ? (
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
      render: (item) => (
        <div className="flex items-center gap-1">
          {item.fileUrl && (
            <button
              type="button"
              onClick={() =>
                window.open(
                  item.fileUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              title="Open syllabus"
              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
            >
              <ExternalLink
                size={17}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              handleEdit(item)
            }
            title="Edit syllabus"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleDelete(item)
            }
            title="Delete syllabus"
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
        title="Syllabus"
        description="Manage syllabus documents and academic curriculum resources."
        action={
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Syllabus
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
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
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search syllabus..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Branch */}
          <select
            value={branchId}
            onChange={(event) =>
              setBranchId(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Branches
            </option>

            {branches.map(
              (branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                >
                  {branch.name}
                </option>
              )
            )}
          </select>

          {/* Semester */}
          <select
            value={semesterId}
            onChange={(event) =>
              setSemesterId(
                event.target.value
              )
            }
            disabled={!branchId}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Semesters
            </option>

            {semesters.map(
              (semester) => (
                <option
                  key={semester._id}
                  value={semester._id}
                >
                  Semester{" "}
                  {
                    semester.semesterNumber
                  }
                </option>
              )
            )}
          </select>

          {/* Subject */}
          <select
            value={subjectId}
            onChange={(event) =>
              setSubjectId(
                event.target.value
              )
            }
            disabled={
              !semesterId
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">
              All Subjects
            </option>

            {subjects.map(
              (subject) => (
                <option
                  key={subject._id}
                  value={subject._id}
                >
                  {subject.name}
                </option>
              )
            )}
          </select>

          {/* Academic Year */}
          <input
            type="text"
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value
              )
            }
            placeholder="Academic year"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Status:
          </span>

          <button
            type="button"
            onClick={() =>
              setPublished("")
            }
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
            onClick={() =>
              setPublished("true")
            }
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
            onClick={() =>
              setPublished("false")
            }
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
            year ||
            published !== "") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBranchId("");
                setSemesterId("");
                setSubjectId("");
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
            {
              filteredSyllabus.length
            }{" "}
            Syllabus
            {filteredSyllabus.length !==
            1
              ? " Records"
              : " Record"}
          </p>

          <p className="text-xs text-slate-500">
            Available in the current view
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSyllabus}
        loading={loading}
        emptyMessage="No syllabus found."
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          if (!loading) {
            setShowModal(false);
            setEditingSyllabus(
              null
            );
          }
        }}
        title={
          editingSyllabus
            ? "Edit Syllabus"
            : "Add Syllabus"
        }
        size="xl"
      >
        <SyllabusForm
          syllabus={editingSyllabus}
          onSuccess={
            handleFormSuccess
          }
          onCancel={() => {
            setShowModal(false);
            setEditingSyllabus(
              null
            );
          }}
        />
      </Modal>
    </div>
  );
}

export default Syllabus;

