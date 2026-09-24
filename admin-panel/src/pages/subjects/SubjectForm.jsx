
import { useEffect, useState } from "react";

import { createSubject, updateSubject } from "../../services/subjectService";
import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";

function SubjectForm({ subject, onSuccess, onCancel }) {
  const isEditMode = Boolean(subject);

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [formData, setFormData] = useState({
    branchId: "",
    semesterId: "",
    name: "",
    code: "",
  });

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingSemesters, setLoadingSemesters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    if (!subject) {
      return;
    }

    const branchId =
      typeof subject.branchId === "object"
        ? subject.branchId?._id
        : subject.branchId;

    const semesterId =
      typeof subject.semesterId === "object"
        ? subject.semesterId?._id
        : subject.semesterId;

    setFormData({
      branchId: branchId || "",
      semesterId: semesterId || "",
      name: subject.name || "",
      code: subject.code || "",
    });

    if (branchId) {
      loadSemesters(branchId);
    }
  }, [subject]);

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      setError("");

      const response = await getBranches();
      setBranches(response?.data || []);
    } catch (err) {
      console.error("Load Branches Error:", err);
      setError(err.message || "Failed to load branches.");
    } finally {
      setLoadingBranches(false);
    }
  };

  const loadSemesters = async (branchId) => {
    if (!branchId) {
      setSemesters([]);
      return;
    }

    try {
      setLoadingSemesters(true);
      setError("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "branchId") {
      setFormData((prev) => ({
        ...prev,
        branchId: value,
        semesterId: "",
      }));

      loadSemesters(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const branchId = formData.branchId.trim();
    const semesterId = formData.semesterId.trim();
    const name = formData.name.trim();
    const code = formData.code.trim().toUpperCase();

    if (!branchId || !semesterId || !name || !code) {
      setError("Branch, semester, subject name and code are required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        branchId,
        semesterId,
        name,
        code,
      };

      if (isEditMode) {
        await updateSubject(subject._id, payload);
      } else {
        await createSubject(payload);
      }

      onSuccess();
    } catch (err) {
      console.error("Save Subject Error:", err);
      setError(err.message || "Failed to save subject.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Branch */}
        <div>
          <label
            htmlFor="branchId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Branch
          </label>

          <select
            id="branchId"
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            disabled={loadingBranches || saving}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          >
            <option value="">
              {loadingBranches
                ? "Loading branches..."
                : "Select branch"}
            </option>

            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label
            htmlFor="semesterId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Semester
          </label>

          <select
            id="semesterId"
            name="semesterId"
            value={formData.semesterId}
            onChange={handleChange}
            disabled={
              !formData.branchId ||
              loadingSemesters ||
              saving
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          >
            <option value="">
              {!formData.branchId
                ? "Select branch first"
                : loadingSemesters
                  ? "Loading semesters..."
                  : "Select semester"}
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

        {/* Subject Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Programming in C"
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              placeholder:text-slate-400
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          />
        </div>

        {/* Subject Code */}
        <div>
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject Code
          </label>

          <input
            id="code"
            name="code"
            type="text"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. PC"
            maxLength={20}
            disabled={saving}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-sm
              uppercase
              text-slate-900
              outline-none
              placeholder:normal-case
              placeholder:text-slate-400
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            focus:outline-none
            focus:ring-4
            focus:ring-slate-200
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-blue-600/20
            transition
            hover:bg-blue-700
            focus:outline-none
            focus:ring-4
            focus:ring-blue-500/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving
            ? "Saving..."
            : isEditMode
              ? "Update Subject"
              : "Create Subject"}
        </button>
      </div>
    </form>
  );
}

export default SubjectForm;

