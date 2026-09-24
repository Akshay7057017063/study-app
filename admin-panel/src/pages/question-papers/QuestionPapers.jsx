
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  ExternalLink,
  FileText,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import QuestionPaperForm from "./QuestionPaperForm";

import {
  deleteQuestionPaper,
  getQuestionPapers,
} from "../../services/questionPaperService";

import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

const examTypeLabels = {
  midterm: "Midterm",
  internal: "Internal",
  prelim: "Prelim",
  university: "University",
  practical: "Practical",
  other: "Other",
};

function QuestionPapers() {
  const [questionPapers, setQuestionPapers] =
    useState([]);

  const [branches, setBranches] =
    useState([]);

  const [semesters, setSemesters] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [search, setSearch] = useState("");

  const [branchFilter, setBranchFilter] =
    useState("");

  const [semesterFilter, setSemesterFilter] =
    useState("");

  const [subjectFilter, setSubjectFilter] =
    useState("");

  const [examTypeFilter, setExamTypeFilter] =
    useState("");

  const [yearFilter, setYearFilter] =
    useState("");

  const [publishedFilter, setPublishedFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingSemesters, setLoadingSemesters] =
    useState(false);

  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingPaper, setEditingPaper] =
    useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!branchFilter) {
      setSemesters([]);
      setSemesterFilter("");
      setSubjects([]);
      setSubjectFilter("");
      return;
    }

    loadSemesters(branchFilter);
  }, [branchFilter]);

  useEffect(() => {
    if (!branchFilter || !semesterFilter) {
      setSubjects([]);
      setSubjectFilter("");
      return;
    }

    loadSubjects(
      branchFilter,
      semesterFilter
    );
  }, [
    branchFilter,
    semesterFilter,
  ]);

  useEffect(() => {
    loadQuestionPapers();
  }, [
    branchFilter,
    semesterFilter,
    subjectFilter,
    examTypeFilter,
    yearFilter,
    publishedFilter,
  ]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        papersResponse,
        branchesResponse,
      ] = await Promise.all([
        getQuestionPapers(),
        getBranches(),
      ]);

      setQuestionPapers(
        papersResponse?.data || []
      );

      setBranches(
        branchesResponse?.data || []
      );
    } catch (err) {
      console.error(
        "Load Question Papers Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load question papers."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionPapers = async () => {
    try {
      setError("");

      const filters = {};

      if (branchFilter) {
        filters.branchId = branchFilter;
      }

      if (semesterFilter) {
        filters.semesterId = semesterFilter;
      }

      if (subjectFilter) {
        filters.subjectId = subjectFilter;
      }

      if (examTypeFilter) {
        filters.examType = examTypeFilter;
      }

      if (yearFilter) {
        filters.year = yearFilter;
      }

      if (publishedFilter) {
        filters.published =
          publishedFilter === "published";
      }

      const response =
        await getQuestionPapers(filters);

      setQuestionPapers(
        response?.data || []
      );
    } catch (err) {
      console.error(
        "Fetch Question Papers Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch question papers."
      );
    }
  };

  const loadSemesters = async (
    branchId
  ) => {
    try {
      setLoadingSemesters(true);

      const response =
        await getSemesters(branchId);

      setSemesters(
        response?.data || []
      );
    } catch (err) {
      console.error(
        "Load Semesters Error:",
        err
      );

      setSemesters([]);

      setError(
        err.message ||
          "Failed to load semesters."
      );
    } finally {
      setLoadingSemesters(false);
    }
  };

  const loadSubjects = async (
    branchId,
    semesterId
  ) => {
    try {
      setLoadingSubjects(true);

      const response =
        await getSubjects(
          branchId,
          semesterId
        );

      setSubjects(
        response?.data || []
      );
    } catch (err) {
      console.error(
        "Load Subjects Error:",
        err
      );

      setSubjects([]);

      setError(
        err.message ||
          "Failed to load subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  const getSubjectName = (paper) => {
    if (
      paper.subjectId &&
      typeof paper.subjectId === "object"
    ) {
      return paper.subjectId.name || "-";
    }

    return "-";
  };

  const getSubjectCode = (paper) => {
    if (
      paper.subjectId &&
      typeof paper.subjectId === "object"
    ) {
      return paper.subjectId.code || "";
    }

    return "";
  };

  const getBranchName = (paper) => {
    if (
      paper.branchId &&
      typeof paper.branchId === "object"
    ) {
      return paper.branchId.name || "-";
    }

    return "-";
  };

  const getBranchCode = (paper) => {
    if (
      paper.branchId &&
      typeof paper.branchId === "object"
    ) {
      return paper.branchId.code || "";
    }

    return "";
  };

  const getSemesterName = (paper) => {
    if (
      paper.semesterId &&
      typeof paper.semesterId === "object"
    ) {
      return `Semester ${paper.semesterId.semesterNumber}`;
    }

    return "-";
  };

  const filteredQuestionPapers =
    useMemo(() => {
      const value = search
        .trim()
        .toLowerCase();

      return questionPapers.filter(
        (paper) => {
          if (!value) {
            return true;
          }

          const searchableValues = [
            paper.title,
            paper.fileName,
            paper.examType,
            paper.year,
            getSubjectName(paper),
            getSubjectCode(paper),
            getBranchName(paper),
            getBranchCode(paper),
            getSemesterName(paper),
          ];

          return searchableValues
            .filter(Boolean)
            .some((item) =>
              String(item)
                .toLowerCase()
                .includes(value)
            );
        }
      );
    }, [questionPapers, search]);

  const openCreateModal = () => {
    setEditingPaper(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (paper) => {
    setEditingPaper(paper);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPaper(null);
  };

  const handleFormSuccess = async () => {
    const wasEditing =
      Boolean(editingPaper);

    closeModal();

    setSuccess(
      wasEditing
        ? "Question paper updated successfully."
        : "Question paper created successfully."
    );

    await loadQuestionPapers();
  };

  const handleDelete = async (paper) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${paper.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteQuestionPaper(
        paper._id
      );

      setSuccess(
        "Question paper deleted successfully."
      );

      await loadQuestionPapers();
    } catch (err) {
      console.error(
        "Delete Question Paper Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete question paper."
      );
    }
  };

  const columns = [
    {
      key: "paper",
      label: "Question Paper",
      render: (paper) => (
        <div className="flex min-w-[250px] items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
            <FileText
              size={18}
              className="text-blue-600"
            />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {paper.title}
            </p>

            {paper.fileName && (
              <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                {paper.fileName}
              </p>
            )}
          </div>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Subject",
      render: (paper) => (
        <div>
          <p className="font-medium text-slate-800">
            {getSubjectName(paper)}
          </p>

          {getSubjectCode(paper) && (
            <p className="mt-0.5 text-xs font-semibold uppercase text-blue-600">
              {getSubjectCode(paper)}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "academic",
      label: "Academic",
      render: (paper) => (
        <div>
          <p className="font-medium text-slate-800">
            {getBranchName(paper)}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {getSemesterName(paper)}
          </p>
        </div>
      ),
    },

    {
      key: "exam",
      label: "Exam",
      render: (paper) => (
        <div>
          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {examTypeLabels[
              paper.examType
            ] ||
              paper.examType ||
              "Other"}
          </span>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={13} />
            {paper.year}
          </div>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (paper) => (
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              paper.isPublished !== false
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {paper.isPublished !== false
            ? "Published"
            : "Draft"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (paper) => (
        <div className="flex items-center gap-2">
          {paper.fileUrl && (
            <a
              href={paper.fileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${paper.title}`}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-2
                text-slate-600
                transition
                hover:border-emerald-200
                hover:bg-emerald-50
                hover:text-emerald-600
                focus:outline-none
                focus:ring-4
                focus:ring-emerald-500/10
              "
            >
              <ExternalLink size={16} />
            </a>
          )}

          <button
            type="button"
            onClick={() =>
              openEditModal(paper)
            }
            aria-label={`Edit ${paper.title}`}
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
            onClick={() =>
              handleDelete(paper)
            }
            aria-label={`Delete ${paper.title}`}
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
        title="Question Papers"
        description="Manage previous examination papers and question paper resources."
        actionLabel="Add Question Paper"
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
                onClick={() =>
                  setSuccess("")
                }
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
                onClick={() =>
                  setError("")
                }
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_170px_140px_150px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search question papers..."
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
              setBranchFilter(
                e.target.value
              )
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
            value={semesterFilter}
            onChange={(e) =>
              setSemesterFilter(
                e.target.value
              )
            }
            disabled={
              !branchFilter ||
              loadingSemesters
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
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          >
            <option value="">
              {!branchFilter
                ? "Select branch first"
                : loadingSemesters
                  ? "Loading..."
                  : "All Semesters"}
            </option>

            {semesters.map(
              (semester) => (
                <option
                  key={semester._id}
                  value={semester._id}
                >
                  Semester{" "}
                  {semester.semesterNumber}
                </option>
              )
            )}
          </select>

          {/* Exam Type */}
          <select
            value={examTypeFilter}
            onChange={(e) =>
              setExamTypeFilter(
                e.target.value
              )
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
            <option value="">
              All Exam Types
            </option>

            {Object.entries(
              examTypeLabels
            ).map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>

          {/* Year */}
          <input
            type="number"
            value={yearFilter}
            onChange={(e) =>
              setYearFilter(
                e.target.value
              )
            }
            placeholder="Year"
            min="2000"
            max="2100"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
            "
          />

          {/* Status */}
          <select
            value={publishedFilter}
            onChange={(e) =>
              setPublishedFilter(
                e.target.value
              )
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
            <option value="">
              All Status
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>
          </select>
        </div>

        {/* Subject */}
        {branchFilter &&
          semesterFilter && (
            <div className="mt-3">
              <select
                value={subjectFilter}
                onChange={(e) =>
                  setSubjectFilter(
                    e.target.value
                  )
                }
                disabled={loadingSubjects}
                className="
                  w-full
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
                  {loadingSubjects
                    ? "Loading subjects..."
                    : "All Subjects"}
                </option>

                {subjects.map(
                  (subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                    >
                      {subject.name} (
                      {subject.code})
                    </option>
                  )
                )}
              </select>
            </div>
          )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredQuestionPapers}
        loading={loading}
        emptyTitle="No question papers found"
        emptyDescription="Add a question paper or change your search and filters."
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingPaper
            ? "Edit Question Paper"
            : "Add Question Paper"
        }
        description={
          editingPaper
            ? "Update the question paper details."
            : "Add a previous examination paper for students."
        }
        size="xl"
      >
        <QuestionPaperForm
          questionPaper={editingPaper}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default QuestionPapers;

