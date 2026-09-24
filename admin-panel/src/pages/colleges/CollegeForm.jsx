
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

import Button from "../../components/common/Button";

import { getUniversities } from "../../services/universityService";

function CollegeForm({
  college = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [universities, setUniversities] = useState([]);
  const [universitiesLoading, setUniversitiesLoading] =
    useState(true);

  const [formData, setFormData] = useState({
    universityId: "",
    name: "",
    code: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  // --------------------------------------------------
  // Load Universities
  // --------------------------------------------------

  useEffect(() => {
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
      } finally {
        setUniversitiesLoading(false);
      }
    };

    loadUniversities();
  }, []);

  // --------------------------------------------------
  // Set Form Data
  // --------------------------------------------------

  useEffect(() => {
    if (college) {
      setFormData({
        universityId:
          college.universityId?._id ||
          college.universityId ||
          "",
        name: college.name || "",
        code: college.code || "",
        city: college.city || "",
      });
    } else {
      setFormData({
        universityId: "",
        name: "",
        code: "",
        city: "",
      });
    }

    setErrors({});
  }, [college]);

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

    if (!formData.universityId) {
      newErrors.universityId =
        "Please select a university.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "College name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "College code is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
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
      universityId: formData.universityId,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      city: formData.city.trim(),
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
      {/* University */}
      <div>
        <label
          htmlFor="universityId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          University
        </label>

        <div className="relative">
          <Building2
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

          <select
            id="universityId"
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            disabled={loading || universitiesLoading}
            className={`
              ${getInputClass("universityId")}
              appearance-none
              pl-10
            `}
          >
            <option value="">
              {universitiesLoading
                ? "Loading universities..."
                : "Select university"}
            </option>

            {universities.map((university) => (
              <option
                key={university._id}
                value={university._id}
              >
                {university.name} (
                {university.shortName})
              </option>
            ))}
          </select>
        </div>

        {errors.universityId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.universityId}
          </p>
        )}
      </div>

      {/* College Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          College Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. S.B. Navale Polytechnic"
          className={getInputClass("name")}
          disabled={loading}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* College Code */}
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          College Code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. SBNP"
          className={getInputClass("code")}
          disabled={loading}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label
          htmlFor="city"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          City
        </label>

        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Sangamner"
          className={getInputClass("city")}
          disabled={loading}
        />

        {errors.city && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.city}
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
          icon="save"
          loading={loading}
        >
          {college
            ? "Update College"
            : "Create College"}
        </Button>
      </div>
    </form>
  );
}

export default CollegeForm;

