
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import Button from "../../components/common/Button";

import { getColleges } from "../../services/collegeService";
import { getFaculties } from "../../services/facultyService";

function CourseForm({
  course = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [formData, setFormData] = useState({
    collegeId: "",
    facultyId: "",
    name: "",
    shortName: "",
    duration: "",
  });

  const [errors, setErrors] = useState({});

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  // ---------------------------------------------
  // Load Colleges & Faculties
  // ---------------------------------------------

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [
          collegesResponse,
          facultiesResponse,
        ] = await Promise.all([
          getColleges(),
          getFaculties(),
        ]);

        setColleges(
          Array.isArray(collegesResponse?.data)
            ? collegesResponse.data
            : []
        );

        setFaculties(
          Array.isArray(facultiesResponse?.data)
            ? facultiesResponse.data
            : []
        );
      } catch (error) {
        console.error(
          "Load Course Options Error:",
          error
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // ---------------------------------------------
  // Load Existing Course
  // ---------------------------------------------

  useEffect(() => {
    if (course) {
      setFormData({
        collegeId:
          course.collegeId?._id ||
          course.collegeId ||
          "",

        facultyId:
          course.facultyId?._id ||
          course.facultyId ||
          "",

        name: course.name || "",

        shortName:
          course.shortName || "",

        duration:
          course.duration !== undefined &&
          course.duration !== null
            ? String(course.duration)
            : "",
      });
    } else {
      setFormData({
        collegeId: "",
        facultyId: "",
        name: "",
        shortName: "",
        duration: "",
      });
    }

    setErrors({});
  }, [course]);

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

    if (!formData.collegeId) {
      newErrors.collegeId =
        "College is required.";
    }

    if (!formData.facultyId) {
      newErrors.facultyId =
        "Faculty is required.";
    }

    if (!formData.name.trim()) {
      newErrors.name =
        "Course name is required.";
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName =
        "Short name is required.";
    }

    if (!formData.duration) {
      newErrors.duration =
        "Duration is required.";
    } else if (
      Number(formData.duration) <= 0
    ) {
      newErrors.duration =
        "Duration must be greater than 0.";
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
      collegeId: formData.collegeId,
      facultyId: formData.facultyId,
      name: formData.name.trim(),
      shortName:
        formData.shortName.trim().toUpperCase(),
      duration: Number(formData.duration),
    });
  };

  // ---------------------------------------------
  // Input Class
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
      {/* College */}
      <div>
        <label
          htmlFor="collegeId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          College
        </label>

        <select
          id="collegeId"
          name="collegeId"
          value={formData.collegeId}
          onChange={handleChange}
          disabled={
            loading || loadingOptions
          }
          className={getInputClass(
            "collegeId"
          )}
        >
          <option value="">
            Select College
          </option>

          {colleges.map((college) => (
            <option
              key={college._id}
              value={college._id}
            >
              {college.name}
              {college.code
                ? ` (${college.code})`
                : ""}
            </option>
          ))}
        </select>

        {errors.collegeId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.collegeId}
          </p>
        )}
      </div>

      {/* Faculty */}
      <div>
        <label
          htmlFor="facultyId"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Faculty
        </label>

        <select
          id="facultyId"
          name="facultyId"
          value={formData.facultyId}
          onChange={handleChange}
          disabled={
            loading || loadingOptions
          }
          className={getInputClass(
            "facultyId"
          )}
        >
          <option value="">
            Select Faculty
          </option>

          {faculties.map((faculty) => (
            <option
              key={faculty._id}
              value={faculty._id}
            >
              {faculty.name}
              {faculty.code
                ? ` (${faculty.code})`
                : ""}
            </option>
          ))}
        </select>

        {errors.facultyId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.facultyId}
          </p>
        )}
      </div>

      {/* Course Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Course Name
        </label>

        <div className="relative">
          <BookOpen
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Diploma in Computer Engineering"
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
          placeholder="e.g. CO"
          disabled={loading}
          className={getInputClass(
            "shortName"
          )}
        />

        {errors.shortName && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.shortName}
          </p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label
          htmlFor="duration"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Duration
        </label>

        <div className="flex gap-3">
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 3"
            disabled={loading}
            className={`
              ${getInputClass("duration")}
              flex-1
            `}
          />

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500">
            Years
          </div>
        </div>

        {errors.duration && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.duration}
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
          {course
            ? "Update Course"
            : "Create Course"}
        </Button>
      </div>
    </form>
  );
}

export default CourseForm;

