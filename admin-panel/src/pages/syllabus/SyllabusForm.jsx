
import { useEffect, useState } from "react";
import {
  Save,
  X,
  AlertCircle,
} from "lucide-react";

import {
  createSyllabus,
  updateSyllabus,
} from "../../services/syllabusService";

import { getUniversities } from "../../services/universityService";
import { getColleges } from "../../services/collegeService";
import { getFaculties } from "../../services/facultyService";
import { getCourses } from "../../services/courseService";
import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

const initialForm = {
  universityId: "",
  collegeId: "",
  facultyId: "",
  courseId: "",
  branchId: "",
  semesterId: "",
  subjectId: "",

  title: "",
  description: "",
  academicYear: "",
  fileName: "",
  fileUrl: "",
  isPublished: true,
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return value._id || value.id || "";
  }

  return value;
};

const getResponseData = (response) => {
  return response?.data || response || [];
};

function SyllabusForm({
  syllabus = null,
  onSuccess,
  onCancel,
}) {
  const isEdit = Boolean(syllabus);

  const [form, setForm] = useState(initialForm);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------
  // Initial data
  // -----------------------------------------

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          universityResponse,
          facultyResponse,
        ] = await Promise.all([
          getUniversities(),
          getFaculties(),
        ]);

        setUniversities(
          getResponseData(universityResponse)
        );

        setFaculties(
          getResponseData(facultyResponse)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load initial data"
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // -----------------------------------------
  // Edit mode
  // -----------------------------------------

  useEffect(() => {
    if (!syllabus) {
      setForm(initialForm);
      return;
    }

    const universityId = getId(
      syllabus.universityId
    );

    const collegeId = getId(
      syllabus.collegeId
    );

    const facultyId = getId(
      syllabus.facultyId
    );

    const courseId = getId(
      syllabus.courseId
    );

    const branchId = getId(
      syllabus.branchId
    );

    const semesterId = getId(
      syllabus.semesterId
    );

    const subjectId = getId(
      syllabus.subjectId
    );

    setForm({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,

      title: syllabus.title || "",
      description:
        syllabus.description || "",
      academicYear:
        syllabus.academicYear || "",
      fileName: syllabus.fileName || "",
      fileUrl: syllabus.fileUrl || "",
      isPublished:
        syllabus.isPublished !== undefined
          ? syllabus.isPublished
          : true,
    });

    const loadEditHierarchy = async () => {
      try {
        setLoadingData(true);
        setError("");

        if (universityId) {
          const response =
            await getColleges(
              universityId
            );

          setColleges(
            getResponseData(response)
          );
        }

        if (collegeId && facultyId) {
          const response =
            await getCourses(
              collegeId,
              facultyId
            );

          setCourses(
            getResponseData(response)
          );
        }

        if (courseId) {
          const response =
            await getBranches(courseId);

          setBranches(
            getResponseData(response)
          );
        }

        if (branchId) {
          const response =
            await getSemesters(branchId);

          setSemesters(
            getResponseData(response)
          );
        }

        if (
          branchId &&
          semesterId
        ) {
          const response =
            await getSubjects(
              branchId,
              semesterId
            );

          setSubjects(
            getResponseData(response)
          );
        }
      } catch (err) {
        setError(
          err.message ||
            "Failed to load syllabus hierarchy"
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadEditHierarchy();
  }, [syllabus]);

  // -----------------------------------------
  // Change handler
  // -----------------------------------------

  const handleChange = async (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setError("");

    // University
    if (name === "universityId") {
      setForm((prev) => ({
        ...prev,
        universityId: value,
        collegeId: "",
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (!value) {
        setColleges([]);
        return;
      }

      try {
        const response =
          await getColleges(value);

        setColleges(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load colleges"
        );
      }

      return;
    }

    // College
    if (name === "collegeId") {
      setForm((prev) => ({
        ...prev,
        collegeId: value,
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (
        !value ||
        !form.facultyId
      ) {
        setCourses([]);
        return;
      }

      try {
        const response =
          await getCourses(
            value,
            form.facultyId
          );

        setCourses(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load courses"
        );
      }

      return;
    }

    // Faculty
    if (name === "facultyId") {
      setForm((prev) => ({
        ...prev,
        facultyId: value,
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (
        !value ||
        !form.collegeId
      ) {
        setCourses([]);
        return;
      }

      try {
        const response =
          await getCourses(
            form.collegeId,
            value
          );

        setCourses(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load courses"
        );
      }

      return;
    }

    // Course
    if (name === "courseId") {
      setForm((prev) => ({
        ...prev,
        courseId: value,
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setSemesters([]);
      setSubjects([]);

      if (!value) {
        setBranches([]);
        return;
      }

      try {
        const response =
          await getBranches(value);

        setBranches(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load branches"
        );
      }

      return;
    }

    // Branch
    if (name === "branchId") {
      setForm((prev) => ({
        ...prev,
        branchId: value,
        semesterId: "",
        subjectId: "",
      }));

      setSubjects([]);

      if (!value) {
        setSemesters([]);
        return;
      }

      try {
        const response =
          await getSemesters(value);

        setSemesters(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load semesters"
        );
      }

      return;
    }

    // Semester
    if (name === "semesterId") {
      setForm((prev) => ({
        ...prev,
        semesterId: value,
        subjectId: "",
      }));

      if (
        !value ||
        !form.branchId
      ) {
        setSubjects([]);
        return;
      }

      try {
        const response =
          await getSubjects(
            form.branchId,
            value
          );

        setSubjects(
          getResponseData(response)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load subjects"
        );
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const requiredFields = [
      ["universityId", "University"],
      ["collegeId", "College"],
      ["facultyId", "Faculty"],
      ["courseId", "Course"],
      ["branchId", "Branch"],
      ["semesterId", "Semester"],
      ["subjectId", "Subject"],
      ["title", "Title"],
      ["academicYear", "Academic Year"],
      ["fileName", "File Name"],
      ["fileUrl", "File URL"],
    ];

    for (const [
      field,
      label,
    ] of requiredFields) {
      if (
        !String(form[field] || "").trim()
      ) {
        setError(
          `${label} is required.`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        universityId:
          form.universityId,
        collegeId:
          form.collegeId,
        facultyId:
          form.facultyId,
        courseId:
          form.courseId,
        branchId:
          form.branchId,
        semesterId:
          form.semesterId,
        subjectId:
          form.subjectId,

        title: form.title.trim(),
        description:
          form.description.trim(),
        academicYear:
          form.academicYear.trim(),
        fileName:
          form.fileName.trim(),
        fileUrl:
          form.fileUrl.trim(),
        isPublished:
          form.isPublished,
      };

      if (isEdit) {
        await updateSyllabus(
          syllabus._id,
          payload
        );
      } else {
        await createSyllabus(payload);
      }

      onSuccess?.();
    } catch (err) {
      setError(
        err.message ||
          `Failed to ${
            isEdit
              ? "update"
              : "create"
          } syllabus`
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Styles
  // -----------------------------------------

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  if (
    loadingData &&
    !universities.length
  ) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading form...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* Academic Hierarchy */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            Academic Hierarchy
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Select the academic structure for this
            syllabus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* University */}
          <div>
            <label className={labelClass}>
              University *
            </label>

            <select
              name="universityId"
              value={form.universityId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">
                Select University
              </option>

              {universities.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* College */}
          <div>
            <label className={labelClass}>
              College *
            </label>

            <select
              name="collegeId"
              value={form.collegeId}
              onChange={handleChange}
              disabled={
                !form.universityId
              }
              className={selectClass}
            >
              <option value="">
                Select College
              </option>

              {colleges.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Faculty */}
          <div>
            <label className={labelClass}>
              Faculty *
            </label>

            <select
              name="facultyId"
              value={form.facultyId}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">
                Select Faculty
              </option>

              {faculties.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className={labelClass}>
              Course *
            </label>

            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              disabled={
                !form.collegeId ||
                !form.facultyId
              }
              className={selectClass}
            >
              <option value="">
                Select Course
              </option>

              {courses.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className={labelClass}>
              Branch *
            </label>

            <select
              name="branchId"
              value={form.branchId}
              onChange={handleChange}
              disabled={
                !form.courseId
              }
              className={selectClass}
            >
              <option value="">
                Select Branch
              </option>

              {branches.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className={labelClass}>
              Semester *
            </label>

            <select
              name="semesterId"
              value={form.semesterId}
              onChange={handleChange}
              disabled={
                !form.branchId
              }
              className={selectClass}
            >
              <option value="">
                Select Semester
              </option>

              {semesters.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    Semester{" "}
                    {item.semesterNumber}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Subject */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Subject *
            </label>

            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              disabled={
                !form.semesterId
              }
              className={selectClass}
            >
              <option value="">
                Select Subject
              </option>

              {subjects.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}{" "}
                    {item.code
                      ? `(${item.code})`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Syllabus Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            Syllabus Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the syllabus details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Syllabus Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Programming in C Syllabus"
              className={inputClass}
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className={labelClass}>
              Academic Year *
            </label>

            <input
              type="text"
              name="academicYear"
              value={
                form.academicYear
              }
              onChange={handleChange}
              placeholder="e.g. 2026-27"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description
            </label>

            <input
              type="text"
              name="description"
              value={
                form.description
              }
              onChange={handleChange}
              placeholder="Short description"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* File Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            File Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add the public URL of the syllabus
            document.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className={labelClass}>
              File Name *
            </label>

            <input
              type="text"
              name="fileName"
              value={form.fileName}
              onChange={handleChange}
              placeholder="e.g. Computer-Engineering-Syllabus.pdf"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              File URL *
            </label>

            <input
              type="url"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/syllabus.pdf"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Publish this syllabus
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Published syllabus can be displayed
              to students.
            </p>
          </div>
        </label>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={17} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />

          {loading
            ? "Saving..."
            : isEdit
            ? "Update Syllabus"
            : "Create Syllabus"}
        </button>
      </div>
    </form>
  );
}

export default SyllabusForm;

