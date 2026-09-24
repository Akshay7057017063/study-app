
import { useEffect, useState } from "react";

import {
  createMaterial,
  updateMaterial,
} from "../../services/materialService";

import { getUniversities } from "../../services/universityService";
import { getColleges } from "../../services/collegeService";
import { getFaculties } from "../../services/facultyService";
import { getCourses } from "../../services/courseService";
import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

const materialTypes = [
  { value: "notes", label: "Notes" },
  { value: "reference", label: "Reference" },
  { value: "video", label: "Video" },
  { value: "link", label: "Link" },
  { value: "other", label: "Other" },
];

function MaterialForm({
  material,
  onSuccess,
  onCancel,
}) {
  const isEditMode = Boolean(material);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    universityId: "",
    collegeId: "",
    facultyId: "",
    courseId: "",
    branchId: "",
    semesterId: "",
    subjectId: "",
    title: "",
    description: "",
    type: "notes",
    fileUrl: "",
    fileName: "",
    isPublished: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!material) {
      return;
    }

    const getId = (value) =>
      typeof value === "object"
        ? value?._id
        : value;

    const universityId = getId(material.universityId);
    const collegeId = getId(material.collegeId);
    const facultyId = getId(material.facultyId);
    const courseId = getId(material.courseId);
    const branchId = getId(material.branchId);
    const semesterId = getId(material.semesterId);
    const subjectId = getId(material.subjectId);

    setFormData({
      universityId: universityId || "",
      collegeId: collegeId || "",
      facultyId: facultyId || "",
      courseId: courseId || "",
      branchId: branchId || "",
      semesterId: semesterId || "",
      subjectId: subjectId || "",
      title: material.title || "",
      description: material.description || "",
      type: material.type || "notes",
      fileUrl: material.fileUrl || "",
      fileName: material.fileName || "",
      isPublished: material.isPublished !== false,
    });

    loadEditHierarchy({
      universityId,
      collegeId,
      facultyId,
      courseId,
      branchId,
      semesterId,
      subjectId,
    });
  }, [material]);

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

      setUniversities(universityResponse?.data || []);
      setFaculties(facultyResponse?.data || []);
    } catch (err) {
      console.error("Load Material Data Error:", err);
      setError(
        err.message || "Failed to load required data."
      );
    } finally {
      setLoadingData(false);
    }
  };

  const loadEditHierarchy = async ({
    universityId,
    collegeId,
    facultyId,
    courseId,
    branchId,
    semesterId,
  }) => {
    try {
      if (universityId) {
        const response = await getColleges(universityId);
        setColleges(response?.data || []);
      }

      if (collegeId && facultyId) {
        const response = await getCourses(
          collegeId,
          facultyId
        );
        setCourses(response?.data || []);
      }

      if (courseId) {
        const response = await getBranches(courseId);
        setBranches(response?.data || []);
      }

      if (branchId) {
        const response = await getSemesters(branchId);
        setSemesters(response?.data || []);
      }

      if (semesterId) {
        const response = await getSubjects(
          branchId,
          semesterId
        );
        setSubjects(response?.data || []);
      }
    } catch (err) {
      console.error(
        "Load Edit Hierarchy Error:",
        err
      );
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "universityId") {
      setFormData((prev) => ({
        ...prev,
        universityId: value,
        collegeId: "",
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setColleges([]);
      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (!value) {
        return;
      }

      try {
        const response = await getColleges(value);
        setColleges(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load colleges.");
      }

      return;
    }

    if (name === "collegeId") {
      setFormData((prev) => ({
        ...prev,
        collegeId: value,
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
        return;
      }

      try {
        const response = await getCourses(value);
        setCourses(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load courses.");
      }

      return;
    }

    if (name === "facultyId") {
      setFormData((prev) => ({
        ...prev,
        facultyId: value,
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (!value || !formData.collegeId) {
        return;
      }

      try {
        const response = await getCourses(
          formData.collegeId,
          value
        );

        setCourses(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load courses.");
      }

      return;
    }

    if (name === "courseId") {
      setFormData((prev) => ({
        ...prev,
        courseId: value,
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      if (!value) {
        return;
      }

      try {
        const response = await getBranches(value);
        setBranches(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load branches.");
      }

      return;
    }

    if (name === "branchId") {
      setFormData((prev) => ({
        ...prev,
        branchId: value,
        semesterId: "",
        subjectId: "",
      }));

      setSemesters([]);
      setSubjects([]);

      if (!value) {
        return;
      }

      try {
        const response = await getSemesters(value);
        setSemesters(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load semesters.");
      }

      return;
    }

    if (name === "semesterId") {
      setFormData((prev) => ({
        ...prev,
        semesterId: value,
        subjectId: "",
      }));

      setSubjects([]);

      if (!value || !formData.branchId) {
        return;
      }

      try {
        const response = await getSubjects(
          formData.branchId,
          value
        );

        setSubjects(response?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load subjects.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const requiredFields = [
      "universityId",
      "collegeId",
      "facultyId",
      "courseId",
      "branchId",
      "semesterId",
      "subjectId",
      "title",
      "type",
      "fileUrl",
      "fileName",
    ];

    const hasMissingField = requiredFields.some(
      (field) => {
        const value = formData[field];

        return (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        );
      }
    );

    if (hasMissingField) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        universityId: formData.universityId,
        collegeId: formData.collegeId,
        facultyId: formData.facultyId,
        courseId: formData.courseId,
        branchId: formData.branchId,
        semesterId: formData.semesterId,
        subjectId: formData.subjectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        fileUrl: formData.fileUrl.trim(),
        fileName: formData.fileName.trim(),
        isPublished: formData.isPublished,
      };

      if (isEditMode) {
        await updateMaterial(
          material._id,
          payload
        );
      } else {
        await createMaterial(payload);
      }

      onSuccess();
    } catch (err) {
      console.error("Save Material Error:", err);
      setError(
        err.message || "Failed to save material."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectClass = `
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
  `;

  const inputClass = `
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
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Academic Hierarchy */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Academic Hierarchy
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Select where this study material belongs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* University */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              University
            </label>

            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              disabled={loadingData || loading}
              className={selectClass}
            >
              <option value="">
                Select university
              </option>

              {universities.map((university) => (
                <option
                  key={university._id}
                  value={university._id}
                >
                  {university.name} ({university.code})
                </option>
              ))}
            </select>
          </div>

          {/* College */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              College
            </label>

            <select
              name="collegeId"
              value={formData.collegeId}
              onChange={handleChange}
              disabled={
                !formData.universityId ||
                loading
              }
              className={selectClass}
            >
              <option value="">
                {!formData.universityId
                  ? "Select university first"
                  : "Select college"}
              </option>

              {colleges.map((college) => (
                <option
                  key={college._id}
                  value={college._id}
                >
                  {college.name} ({college.code})
                </option>
              ))}
            </select>
          </div>

          {/* Faculty */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Faculty
            </label>

            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              disabled={loading}
              className={selectClass}
            >
              <option value="">
                Select faculty
              </option>

              {faculties.map((faculty) => (
                <option
                  key={faculty._id}
                  value={faculty._id}
                >
                  {faculty.name} ({faculty.code})
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Course
            </label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={
                !formData.collegeId ||
                !formData.facultyId ||
                loading
              }
              className={selectClass}
            >
              <option value="">
                {!formData.collegeId
                  ? "Select college first"
                  : !formData.facultyId
                    ? "Select faculty first"
                    : "Select course"}
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.name} ({course.shortName})
                </option>
              ))}
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Branch
            </label>

            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              disabled={
                !formData.courseId ||
                loading
              }
              className={selectClass}
            >
              <option value="">
                {!formData.courseId
                  ? "Select course first"
                  : "Select branch"}
              </option>

              {branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                >
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Semester
            </label>

            <select
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              disabled={
                !formData.branchId ||
                loading
              }
              className={selectClass}
            >
              <option value="">
                {!formData.branchId
                  ? "Select branch first"
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

          {/* Subject */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>

            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              disabled={
                !formData.semesterId ||
                loading
              }
              className={selectClass}
            >
              <option value="">
                {!formData.semesterId
                  ? "Select semester first"
                  : "Select subject"}
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject._id}
                  value={subject._id}
                >
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Material Details */}
      <div className="border-t border-slate-200 pt-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Material Details
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Enter the information students will see.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Material Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Programming in C - Unit 1 Notes"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short description of this study material..."
              disabled={loading}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Material Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
              className={selectClass}
            >
              {materialTypes.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              File Name
            </label>

            <input
              type="text"
              name="fileName"
              value={formData.fileName}
              onChange={handleChange}
              placeholder="e.g. unit-1-notes.pdf"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* File URL */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              File / Resource URL
            </label>

            <input
              type="url"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/material.pdf"
              disabled={loading}
              className={inputClass}
            />

            <p className="mt-2 text-xs text-slate-500">
              Add the public URL of the PDF, document, video or
              other resource.
            </p>
          </div>

          {/* Published */}
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Publish material
                </span>

                <span className="block text-xs text-slate-500">
                  Students can see this material when published.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
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
          disabled={loading}
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
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Material"
              : "Create Material"}
        </button>
      </div>
    </form>
  );
}

export default MaterialForm;

