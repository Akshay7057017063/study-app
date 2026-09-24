
import { useEffect, useMemo, useState } from "react";
import {
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
import MaterialForm from "./MaterialForm";

import {
  deleteMaterial,
  getMaterials,
} from "../../services/materialService";

import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

const materialTypeLabels = {
  notes: "Notes",
  reference: "Reference",
  video: "Video",
  link: "Link",
  other: "Other",
};

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState("");

  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

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

    loadSubjects(branchFilter, semesterFilter);
  }, [branchFilter, semesterFilter]);

  useEffect(() => {
    loadMaterials();
  }, [
    branchFilter,
    semesterFilter,
    subjectFilter,
    typeFilter,
    publishedFilter,
  ]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        materialResponse,
        branchResponse,
      ] = await Promise.all([
        getMaterials(),
        getBranches(),
      ]);

      setMaterials(materialResponse?.data || []);
      setBranches(branchResponse?.data || []);
    } catch (err) {
      console.error(
        "Load Materials Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load study materials."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
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

      const response = await getMaterials(filters);

      setMaterials(response?.data || []);
    } catch (err) {
      console.error(
        "Fetch Materials Error:",
        err
      );

      setError(
        err.message ||
          "Failed to fetch study materials."
      );
    }
  };

  const loadSemesters = async (branchId) => {
    try {
      setLoadingSemesters(true);

      const response = await getSemesters(branchId);

      setSemesters(response?.data || []);
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

      const response = await getSubjects(
        branchId,
        semesterId
      );

      setSubjects(response?.data || []);
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

  const filteredMaterials = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    return materials.filter((material) => {
      const branchName =
        typeof material.branchId === "object"
          ? material.branchId?.name
          : "";

      const branchCode =
        typeof material.branchId === "object"
          ? material.branchId?.code
          : "";

      const semesterNumber =
        typeof material.semesterId === "object"
          ? material.semesterId?.semesterNumber
          : "";

      const subjectName =
        typeof material.subjectId === "object"
          ? material.subjectId?.name
          : "";

      const subjectCode =
        typeof material.subjectId === "object"
          ? material.subjectId?.code
          : "";

      const matchesSearch =
        !value ||
        [
          material.title,
          material.description,
          material.fileName,
          material.type,
          branchName,
          branchCode,
          semesterNumber,
          subjectName,
          subjectCode,
        ]
          .filter(Boolean)
          .some((item) =>
            String(item)
              .toLowerCase()
              .includes(value)
          );

      const matchesType =
        !typeFilter ||
        material.type === typeFilter;

      const matchesPublished =
        !publishedFilter ||
        (publishedFilter === "published"
          ? material.isPublished !== false
          : material.isPublished === false);

      return (
        matchesSearch &&
        matchesType &&
        matchesPublished
      );
    });
  }, [
    materials,
    search,
    typeFilter,
    publishedFilter,
  ]);

  const openCreateModal = () => {
    setEditingMaterial(null);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (material) => {
    setEditingMaterial(material);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMaterial(null);
  };

  const handleFormSuccess = async () => {
    const wasEditing = Boolean(
      editingMaterial
    );

    closeModal();

    setSuccess(
      wasEditing
        ? "Study material updated successfully."
        : "Study material created successfully."
    );

    await loadMaterials();
  };

  const handleDelete = async (material) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${material.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteMaterial(material._id);

      setSuccess(
        "Study material deleted successfully."
      );

      await loadMaterials();
    } catch (err) {
      console.error(
        "Delete Material Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete study material."
      );
    }
  };

  const getBranchName = (material) => {
    if (
      material.branchId &&
      typeof material.branchId === "object"
    ) {
      return material.branchId.name || "-";
    }

    return "-";
  };

  const getSemester = (material) => {
    if (
      material.semesterId &&
      typeof material.semesterId === "object"
    ) {
      return `Semester ${material.semesterId.semesterNumber}`;
    }

    return "-";
  };

  const getSubjectName = (material) => {
    if (
      material.subjectId &&
      typeof material.subjectId === "object"
    ) {
      return material.subjectId.name || "-";
    }

    return "-";
  };

  const getSubjectCode = (material) => {
    if (
      material.subjectId &&
      typeof material.subjectId === "object"
    ) {
      return material.subjectId.code || "";
    }

    return "";
  };

  const columns = [
    {
      key: "title",
      label: "Material",
      render: (material) => (
        <div className="flex min-w-[240px] items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
            <FileText
              size={18}
              className="text-blue-600"
            />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {material.title}
            </p>

            {material.fileName && (
              <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                {material.fileName}
              </p>
            )}
          </div>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Subject",
      render: (material) => (
        <div>
          <p className="font-medium text-slate-800">
            {getSubjectName(material)}
          </p>

          {getSubjectCode(material) && (
            <p className="mt-0.5 text-xs font-medium uppercase text-blue-600">
              {getSubjectCode(material)}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "academic",
      label: "Academic",
      render: (material) => (
        <div>
          <p className="font-medium text-slate-800">
            {getBranchName(material)}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {getSemester(material)}
          </p>
        </div>
      ),
    },

    {
      key: "type",
      label: "Type",
      render: (material) => {
        const label =
          materialTypeLabels[
            material.type
          ] ||
          material.type ||
          "Other";

        return (
          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {label}
          </span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      render: (material) => (
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              material.isPublished !== false
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {material.isPublished !== false
            ? "Published"
            : "Draft"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (material) => (
        <div className="flex items-center gap-2">
          {material.fileUrl && (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${material.title}`}
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
              openEditModal(material)
            }
            aria-label={`Edit ${material.title}`}
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
              handleDelete(material)
            }
            aria-label={`Delete ${material.title}`}
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
        title="Study Materials"
        description="Manage notes, references, videos and other learning resources."
        actionLabel="Add Material"
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_200px_210px_160px_160px]">
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
              placeholder="Search materials, subjects, files..."
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
              setSemesterFilter(e.target.value)
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

            {semesters.map((semester) => (
              <option
                key={semester._id}
                value={semester._id}
              >
                Semester{" "}
                {semester.semesterNumber}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
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
              All Types
            </option>

            {Object.entries(
              materialTypeLabels
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>

          {/* Published */}
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

        {/* Subject Filter */}
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

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name} (
                    {subject.code})
                  </option>
                ))}
              </select>
            </div>
          )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredMaterials}
        loading={loading}
        emptyTitle="No study materials found"
        emptyDescription="Add a material or change your search and filters."
      />

      {/* Material Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingMaterial
            ? "Edit Study Material"
            : "Add Study Material"
        }
        description={
          editingMaterial
            ? "Update the study material details."
            : "Add a new learning resource for students."
        }
        size="xl"
      >
        <MaterialForm
          material={editingMaterial}
          onSuccess={handleFormSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default Materials;

