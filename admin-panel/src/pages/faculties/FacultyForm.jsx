
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

import Button from "../../components/common/Button";

function FacultyForm({
  faculty = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  // --------------------------------------------------
  // Load Faculty Data for Edit
  // --------------------------------------------------

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || "",
        code: faculty.code || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
      });
    }

    setErrors({});
  }, [faculty]);

  // --------------------------------------------------
  // Change Handler
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Faculty name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Faculty code is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
    });
  };

  // --------------------------------------------------
  // Input Classes
  // --------------------------------------------------

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
      {/* Faculty Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Faculty Name
        </label>

        <div className="relative">
          <GraduationCap
            size={18}
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Engineering"
            className={`
              ${getInputClass("name")}
              pl-10
            `}
            disabled={loading}
          />
        </div>

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Faculty Code */}
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Faculty Code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. ENG"
          className={getInputClass("code")}
          disabled={loading}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Use a short unique code for this faculty.
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
          {faculty
            ? "Update Faculty"
            : "Create Faculty"}
        </Button>
      </div>
    </form>
  );
}

export default FacultyForm;

