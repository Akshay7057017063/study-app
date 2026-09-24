
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import CollegeForm from "./CollegeForm";

import {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../../services/collegeService";

import { getUniversities } from "../../services/universityService";

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [universitiesLoading, setUniversitiesLoading] =
    useState(true);

  const [search, setSearch] = useState("");
  const [universityFilter, setUniversityFilter] =
    useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] =
    useState(null);

  const [formLoading, setFormLoading] = useState(false);

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
  // Load Universities
  // --------------------------------------------------

  const loadUniversities = async () => {
    try {
      setUniversitiesLoading(true);

      const response = await getUniversities();

      const data = response?.data;

      setUniversities(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Load Universities Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to load universities."
      );
    } finally {
      setUniversitiesLoading(false);
    }
  };

  // --------------------------------------------------
  // Load Colleges
  // --------------------------------------------------

  const loadColleges = async () => {
    try {
      setLoading(true);

      const response = await getColleges();

      console.log(
        "COLLEGES RESPONSE:",
        response
      );

      const data = response?.data;

      setColleges(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Load Colleges Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to load colleges."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
    loadColleges();
  }, []);

  // --------------------------------------------------
  // University Name Helper
  // --------------------------------------------------

  const getUniversityName = (college) => {
    if (
      college.universityId &&
      typeof college.universityId === "object"
    ) {
      return (
        college.universityId.name ||
        college.universityId.shortName ||
        "Unknown University"
      );
    }

    const university = universities.find(
      (item) =>
        item._id === college.universityId
    );

    return (
      university?.name ||
      university?.shortName ||
      "Unknown University"
    );
  };

  // --------------------------------------------------
  // Filter
  // --------------------------------------------------

  const filteredColleges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return colleges.filter((college) => {
      const universityId =
        typeof college.universityId === "object"
          ? college.universityId?._id
          : college.universityId;

      const matchesUniversity =
        !universityFilter ||
        universityId === universityFilter;

      const universityName =
        getUniversityName(college);

      const matchesSearch =
        !query ||
        college.name
          ?.toLowerCase()
          .includes(query) ||
        college.code
          ?.toLowerCase()
          .includes(query) ||
        college.city
          ?.toLowerCase()
          .includes(query) ||
        universityName
          ?.toLowerCase()
          .includes(query);

      return (
        matchesUniversity &&
        matchesSearch
      );
    });
  }, [
    colleges,
    universities,
    search,
    universityFilter,
  ]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingCollege(null);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (college) => {
    setEditingCollege(college);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Close Form Modal
  // --------------------------------------------------

  const handleCloseModal = () => {
    if (formLoading) {
      return;
    }

    setModalOpen(false);
    setEditingCollege(null);
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingCollege) {
        const response = await updateCollege(
          editingCollege._id,
          formData
        );

        console.log(
          "UPDATE COLLEGE RESPONSE:",
          response
        );

        showMessage(
          "success",
          "College updated successfully."
        );
      } else {
        const response = await createCollege(
          formData
        );

        console.log(
          "CREATE COLLEGE RESPONSE:",
          response
        );

        showMessage(
          "success",
          "College created successfully."
        );
      }

      setModalOpen(false);
      setEditingCollege(null);

      await loadColleges();
    } catch (error) {
      console.error(
        "Save College Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to save college."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteClick = (college) => {
    setDeleteTarget(college);
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

      await deleteCollege(
        deleteTarget._id
      );

      showMessage(
        "success",
        "College deleted successfully."
      );

      setDeleteTarget(null);

      await loadColleges();
    } catch (error) {
      console.error(
        "Delete College Error:",
        error
      );

      showMessage(
        "error",
        error.message ||
          "Failed to delete college."
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
      label: "College",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <Building2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {row.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {row.code || "-"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "university",
      label: "University",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700">
          {getUniversityName(row)}
        </span>
      ),
    },

    {
      key: "city",
      label: "City",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin
            size={15}
            className="text-slate-400"
          />
          {row.city || "-"}
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
            title="Edit college"
            onClick={() =>
              handleEdit(row)
            }
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-600
              transition-colors
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            title="Delete college"
            onClick={() =>
              handleDeleteClick(row)
            }
            className="
              inline-flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-600
              transition-colors
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus:outline-none
              focus:ring-2
              focus:ring-red-500
            "
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Colleges"
        description="Manage colleges and associate them with universities."
        actionLabel="Add College"
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
            aria-label="Close message"
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
            className="rounded-lg p-1 transition-colors hover:bg-white/70"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_280px_auto]">
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
              placeholder="Search college, code, city or university..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-10
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>

          {/* University Filter */}
          <select
            value={universityFilter}
            onChange={(event) =>
              setUniversityFilter(
                event.target.value
              )
            }
            disabled={universitiesLoading}
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-700
              outline-none
              transition-all
              focus:border-blue-500
              focus:bg-white
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">
              All Universities
            </option>

            {universities.map(
              (university) => (
                <option
                  key={university._id}
                  value={university._id}
                >
                  {university.shortName ||
                    university.name}
                </option>
              )
            )}
          </select>

          {/* Count */}
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 lg:min-w-[130px]">
            <span className="mr-1 font-semibold text-slate-900">
              {filteredColleges.length}
            </span>

            {filteredColleges.length === 1
              ? "College"
              : "Colleges"}
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredColleges}
        loading={loading}
        emptyTitle={
          search || universityFilter
            ? "No colleges found"
            : "No colleges added yet"
        }
        emptyDescription={
          search || universityFilter
            ? "Try changing your search or university filter."
            : "Add your first college to start building the study hierarchy."
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          editingCollege
            ? "Edit College"
            : "Add College"
        }
        description={
          editingCollege
            ? "Update the college information below."
            : "Enter the details for the new college."
        }
        size="md"
      >
        <CollegeForm
          college={editingCollege}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={handleDeleteCancel}
        title="Delete College"
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
                  this college?
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
              Delete College
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Colleges;

