
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import UniversityForm from "./UniversityForm";

import {
  getUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../../services/universityService";

function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] =
    useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // --------------------------------------------------
  // Load Universities
  // --------------------------------------------------

  const loadUniversities = async () => {
    try {
      setLoading(true);

      const response = await getUniversities();

      console.log("UNIVERSITIES RESPONSE:", response);

      const data = response?.data;

      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load Universities Error:", error);

      showMessage(
        "error",
        error.message || "Failed to load universities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

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
  // Search
  // --------------------------------------------------

  const filteredUniversities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return universities;
    }

    return universities.filter((university) => {
      return (
        university.name?.toLowerCase().includes(query) ||
        university.shortName
          ?.toLowerCase()
          .includes(query) ||
        university.code?.toLowerCase().includes(query)
      );
    });
  }, [universities, search]);

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingUniversity(null);
    setModalOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (university) => {
    setEditingUniversity(university);
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
    setEditingUniversity(null);
  };

  // --------------------------------------------------
  // Create / Update
  // --------------------------------------------------

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (editingUniversity) {
        const response = await updateUniversity(
          editingUniversity._id,
          formData
        );

        console.log("UPDATE UNIVERSITY RESPONSE:", response);

        showMessage(
          "success",
          "University updated successfully."
        );
      } else {
        const response = await createUniversity(formData);

        console.log("CREATE UNIVERSITY RESPONSE:", response);

        showMessage(
          "success",
          "University created successfully."
        );
      }

      setModalOpen(false);
      setEditingUniversity(null);

      await loadUniversities();
    } catch (error) {
      console.error("Save University Error:", error);

      showMessage(
        "error",
        error.message || "Failed to save university."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteClick = (university) => {
    setDeleteTarget(university);
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

      await deleteUniversity(deleteTarget._id);

      showMessage(
        "success",
        "University deleted successfully."
      );

      setDeleteTarget(null);

      await loadUniversities();
    } catch (error) {
      console.error("Delete University Error:", error);

      showMessage(
        "error",
        error.message || "Failed to delete university."
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
      key: "name",
      label: "University",
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
              {row.shortName || "-"}
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
            onClick={() => handleEdit(row)}
            title="Edit university"
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
            onClick={() => handleDeleteClick(row)}
            title="Delete university"
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
      {/* Page Header */}
      <PageHeader
        title="Universities"
        description="Manage universities available in the StudyHub system."
        actionLabel="Add University"
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
            className="rounded-lg p-1 transition-colors hover:bg-white/70"
            aria-label="Close message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search + Summary */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search university..."
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

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {filteredUniversities.length}
          </span>

          {filteredUniversities.length === 1
            ? "university"
            : "universities"}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredUniversities}
        loading={loading}
        emptyTitle={
          search
            ? "No universities found"
            : "No universities added yet"
        }
        emptyDescription={
          search
            ? "Try a different search term."
            : "Add your first university to start building the study hierarchy."
        }
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          editingUniversity
            ? "Edit University"
            : "Add University"
        }
        description={
          editingUniversity
            ? "Update the university information below."
            : "Enter the details for the new university."
        }
        size="md"
      >
        <UniversityForm
          university={editingUniversity}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={handleDeleteCancel}
        title="Delete University"
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
                  Are you sure you want to delete this
                  university?
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
              Delete University
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Universities;

