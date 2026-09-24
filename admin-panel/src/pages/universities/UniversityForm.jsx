
import { useEffect, useState } from "react";

import Button from "../../components/common/Button";

function UniversityForm({
  university = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name || "",
        shortName: university.shortName || "",
        code: university.code || "",
      });
    } else {
      setFormData({
        name: "",
        shortName: "",
        code: "",
      });
    }

    setErrors({});
  }, [university]);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "University name is required.";
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = "Short name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "University code is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: formData.name.trim(),
      shortName: formData.shortName.trim(),
      code: formData.code.trim().toUpperCase(),
    });
  };

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* University Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          University Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Savitribai Phule Pune University"
          className={getInputClass("name")}
          disabled={loading}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Short Name */}
      <div>
        <label
          htmlFor="shortName"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Short Name
        </label>

        <input
          id="shortName"
          name="shortName"
          type="text"
          value={formData.shortName}
          onChange={handleChange}
          placeholder="e.g. SPPU"
          className={getInputClass("shortName")}
          disabled={loading}
        />

        {errors.shortName && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.shortName}
          </p>
        )}
      </div>

      {/* University Code */}
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          University Code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. SPPU"
          className={getInputClass("code")}
          disabled={loading}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code}
          </p>
        )}
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
          loading={loading}
          icon="save"
        >
          {university ? "Update University" : "Create University"}
        </Button>
      </div>
    </form>
  );
}

export default UniversityForm;

