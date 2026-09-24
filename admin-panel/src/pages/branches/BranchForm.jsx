
import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";

import Button from "../../components/common/Button";

import { getCourses } from "../../services/courseService";

function BranchForm({
  branch = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    courseId: "",
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingCourses, setLoadingCourses] =
    useState(true);

  // --------------------------------------------------
  // Load Courses
  // --------------------------------------------------

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);

        const response = await getCourses();

        console.log(
          "COURSES FOR BRANCH:",
          response
        );

        setCourses(
          Array.isArray(response?.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Load Courses Error:",
          error
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // --------------------------------------------------
  // Load Existing Branch
  // --------------------------------------------------

  useEffect(() => {
    if (branch) {
      setFormData({
        courseId:
          branch.courseId?._id ||
          branch.courseId ||
          "",

        name: branch.name || "",

        code: branch.code || "",
      });
    } else {
      setFormData({
        courseId: "",
        name: "",
        code: "",
      });
    }

    setErrors({});
  }, [branch]);

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

    if (!formData.courseId) {
      newErrors.courseId =
        "Course is required.";
    }

    if (!formData.name.trim()) {
      newErrors.name =
        "Branch name is required.";
    }

    if (!formData.code.trim()) {
      newErrors.code =
        "Branch code is required.";
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
      courseId: formData.courseId,
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
      {/* Course */}
      <div>
        <label
          htmlFor="courseId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Course
        </label>

        <select
          id="courseId"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          disabled={
            loading || loadingCourses
          }
          className={getInputClass(
            "courseId"
          )}
        >
          <option value="">
            Select Course
          </option>

          {courses.map((course) => (
            <option
              key={course._id}
              value={course._id}
            >
              {course.name}
              {course.shortName
                ? ` (${course.shortName})`
                : ""}
            </option>
          ))}
        </select>

        {errors.courseId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.courseId}
          </p>
        )}
      </div>

      {/* Branch Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Branch Name
        </label>

        <div className="relative">
          <GitBranch
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Computer Engineering"
            disabled={loading}
            className={`
              ${getInputClass("name")}
              pl-10
            `}
          />
        </div>

        {errors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Branch Code */}
      <div>
        <label
          htmlFor="code"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Branch Code
        </label>

        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. CO"
          disabled={loading}
          className={getInputClass("code")}
        />

        {errors.code && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.code}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Use a short unique code for the branch.
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
          {branch
            ? "Update Branch"
            : "Create Branch"}
        </Button>
      </div>
    </form>
  );
}

export default BranchForm;

