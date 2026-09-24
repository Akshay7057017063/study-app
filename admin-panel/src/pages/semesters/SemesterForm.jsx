
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import Button from "../../components/common/Button";

import { getBranches } from "../../services/branchService";

function SemesterForm({
  semester = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [branches, setBranches] = useState([]);

  const [formData, setFormData] = useState({
    branchId: "",
    semesterNumber: "",
    academicYear: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingBranches, setLoadingBranches] =
    useState(true);

  // ---------------------------------------------
  // Load Branches
  // ---------------------------------------------

  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoadingBranches(true);

        const response = await getBranches();

        console.log(
          "BRANCHES FOR SEMESTER:",
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
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, []);

  // ---------------------------------------------
  // Load Existing Semester
  // ---------------------------------------------

  useEffect(() => {
    if (semester) {
      setFormData({
        branchId:
          semester.branchId?._id ||
          semester.branchId ||
          "",

        semesterNumber:
          semester.semesterNumber !==
            undefined &&
          semester.semesterNumber !== null
            ? String(
                semester.semesterNumber
              )
            : "",

        academicYear:
          semester.academicYear || "",
      });
    } else {
      setFormData({
        branchId: "",
        semesterNumber: "",
        academicYear: "",
      });
    }

    setErrors({});
  }, [semester]);

  // ---------------------------------------------
  // Change
  // ---------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // ---------------------------------------------
  // Validation
  // ---------------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!formData.branchId) {
      newErrors.branchId =
        "Branch is required.";
    }

    if (!formData.semesterNumber) {
      newErrors.semesterNumber =
        "Semester number is required.";
    } else {
      const number = Number(
        formData.semesterNumber
      );

      if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 12
      ) {
        newErrors.semesterNumber =
          "Semester must be between 1 and 12.";
      }
    }

    if (!formData.academicYear.trim()) {
      newErrors.academicYear =
        "Academic year is required.";
    } else if (
      !/^\d{4}-\d{2}$/.test(
        formData.academicYear.trim()
      )
    ) {
      newErrors.academicYear =
        "Use format YYYY-YY, e.g. 2026-27.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------
  // Submit
  // ---------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      branchId: formData.branchId,
      semesterNumber: Number(
        formData.semesterNumber
      ),
      academicYear:
        formData.academicYear.trim(),
    });
  };

  // ---------------------------------------------
  // Input Classes
  // ---------------------------------------------

  const getInputClass = (field) => {
    const hasError = Boolean(errors[field]);

    return `
      w-full
      rounded-xl
      border
      ${
        hasError
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
      }
      bg-white
      px-4
      py-3
      text-sm
      text-slate-900
      outline-none
      transition-all
      placeholder:text-slate-400
      focus:ring-4
      disabled:cursor-not-allowed
      disabled:bg-slate-50
      disabled:text-slate-400
    `;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
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
          disabled={
            loading || loadingBranches
          }
          className={getInputClass(
            "branchId"
          )}
        >
          <option value="">
            Select Branch
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

        {errors.branchId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.branchId}
          </p>
        )}
      </div>

      {/* Semester Number */}
      <div>
        <label
          htmlFor="semesterNumber"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Semester Number
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="semesterNumber"
            name="semesterNumber"
            value={
              formData.semesterNumber
            }
            onChange={handleChange}
            disabled={loading}
            className={`
              ${getInputClass(
                "semesterNumber"
              )}
              pl-10
            `}
          >
            <option value="">
              Select Semester
            </option>

            {Array.from(
              { length: 12 },
              (_, index) => index + 1
            ).map((number) => (
              <option
                key={number}
                value={number}
              >
                Semester {number}
              </option>
            ))}
          </select>
        </div>

        {errors.semesterNumber && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.semesterNumber}
          </p>
        )}
      </div>

      {/* Academic Year */}
      <div>
        <label
          htmlFor="academicYear"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Academic Year
        </label>

        <input
          id="academicYear"
          name="academicYear"
          type="text"
          value={formData.academicYear}
          onChange={handleChange}
          placeholder="e.g. 2026-27"
          disabled={loading}
          maxLength={7}
          className={getInputClass(
            "academicYear"
          )}
        />

        {errors.academicYear && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.academicYear}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Format: YYYY-YY
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          icon="save"
          loading={loading}
        >
          {semester
            ? "Update Semester"
            : "Create Semester"}
        </Button>
      </div>
    </form>
  );
}

export default SemesterForm;

