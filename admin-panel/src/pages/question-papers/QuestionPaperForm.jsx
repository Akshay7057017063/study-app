
import { useEffect, useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  Save,
  X,
} from "lucide-react";

import { getUniversities } from "../../services/universityService";
import { getColleges } from "../../services/collegeService";
import { getFaculties } from "../../services/facultyService";
import { getCourses } from "../../services/courseService";
import { getBranches } from "../../services/branchService";
import { getSemesters } from "../../services/semesterService";
import { getSubjects } from "../../services/subjectService";

import {
  createQuestionPaper,
  updateQuestionPaper,
} from "../../services/questionPaperService";

const examTypes = [
  {
    value: "midterm",
    label: "Midterm",
  },
  {
    value: "internal",
    label: "Internal",
  },
  {
    value: "prelim",
    label: "Prelim",
  },
  {
    value: "university",
    label: "University",
  },
  {
    value: "practical",
    label: "Practical",
  },
  {
    value: "other",
    label: "Other",
  },
];

const initialForm = {
  universityId: "",
  collegeId: "",
  facultyId: "",
  courseId: "",
  branchId: "",
  semesterId: "",
  subjectId: "",

  title: "",
  examType: "university",
  year: new Date().getFullYear(),

  fileUrl: "",
  fileName: "",

  isPublished: true,
};

function getId(value) {
  if (!value) return "";

  if (typeof value === "object") {
    return value._id || "";
  }

  return value;
}

function QuestionPaperForm({
  questionPaper = null,
  onSuccess,
  onCancel,
}) {
  const isEditMode = Boolean(questionPaper);

  const [form, setForm] = useState(initialForm);

  const [universities, setUniversities] =
    useState([]);

  const [colleges, setColleges] =
    useState([]);

  const [faculties, setFaculties] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [branches, setBranches] =
    useState([]);

  const [semesters, setSemesters] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [loadingInitial, setLoadingInitial] =
    useState(true);

  const [loadingColleges, setLoadingColleges] =
    useState(false);

  const [loadingCourses, setLoadingCourses] =
    useState(false);

  const [loadingBranches, setLoadingBranches] =
    useState(false);

  const [loadingSemesters, setLoadingSemesters] =
    useState(false);

  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!isEditMode || !universities.length) {
      return;
    }

    loadEditHierarchy();
  }, [isEditMode, universities]);

  const loadInitialData = async () => {
    try {
      setLoadingInitial(true);
      setError("");

      const [
        universityResponse,
        facultyResponse,
      ] = await Promise.all([
        getUniversities(),
        getFaculties(),
      ]);

      setUniversities(
        universityResponse?.data || []
      );

      setFaculties(
        facultyResponse?.data || []
      );
    } catch (err) {
      console.error(
        "Question Paper Initial Load Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load form data."
      );
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadEditHierarchy = async () => {
    try {
      setLoadingInitial(true);
      setError("");

      const universityId = getId(
        questionPaper.universityId
      );

      const collegeId = getId(
        questionPaper.collegeId
      );

      const facultyId = getId(
        questionPaper.facultyId
      );

      const courseId = getId(
        questionPaper.courseId
      );

      const branchId = getId(
        questionPaper.branchId
      );

      const semesterId = getId(
        questionPaper.semesterId
      );

      const subjectId = getId(
        questionPaper.subjectId
      );

      setForm({
        universityId,
        collegeId,
        facultyId,
        courseId,
        branchId,
        semesterId,
        subjectId,

        title: questionPaper.title || "",
        examType:
          questionPaper.examType ||
          "university",
        year:
          questionPaper.year ||
          new Date().getFullYear(),

        fileUrl:
          questionPaper.fileUrl || "",
        fileName:
          questionPaper.fileName || "",

        isPublished:
          questionPaper.isPublished !== false,
      });

      let loadedColleges = [];
      let loadedCourses = [];
      let loadedBranches = [];
      let loadedSemesters = [];
      let loadedSubjects = [];

      if (universityId) {
        const response =
          await getColleges(universityId);

        loadedColleges =
          response?.data || [];

        setColleges(loadedColleges);
      }

      if (collegeId && facultyId) {
        const response =
          await getCourses(
            collegeId,
            facultyId
          );

        loadedCourses =
          response?.data || [];

        setCourses(loadedCourses);
      }

      if (courseId) {
        const response =
          await getBranches(courseId);

        loadedBranches =
          response?.data || [];

        setBranches(loadedBranches);
      }

      if (branchId) {
        const response =
          await getSemesters(branchId);

        loadedSemesters =
          response?.data || [];

        setSemesters(loadedSemesters);
      }

      if (branchId && semesterId) {
        const response =
          await getSubjects(
            branchId,
            semesterId
          );

        loadedSubjects =
          response?.data || [];

        setSubjects(loadedSubjects);
      }
    } catch (err) {
      console.error(
        "Question Paper Edit Load Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load question paper data."
      );
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleChange = async (event) => {
    const { name, value, type, checked } =
      event.target;

    const newValue =
      type === "checkbox"
        ? checked
        : value;

    setForm((previous) => ({
      ...previous,
      [name]: newValue,
    }));

    setError("");

    if (name === "universityId") {
      setColleges([]);
      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        universityId: value,
        collegeId: "",
        facultyId: "",
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      if (!value) return;

      try {
        setLoadingColleges(true);

        const response =
          await getColleges(value);

        setColleges(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load colleges."
        );
      } finally {
        setLoadingColleges(false);
      }

      return;
    }

    if (name === "collegeId") {
      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        collegeId: value,
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      if (!value || !form.facultyId) {
        return;
      }

      try {
        setLoadingCourses(true);

        const response =
          await getCourses(
            value,
            form.facultyId
          );

        setCourses(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load courses."
        );
      } finally {
        setLoadingCourses(false);
      }

      return;
    }

    if (name === "facultyId") {
      setCourses([]);
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        facultyId: value,
        courseId: "",
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      if (!value || !form.collegeId) {
        return;
      }

      try {
        setLoadingCourses(true);

        const response =
          await getCourses(
            form.collegeId,
            value
          );

        setCourses(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load courses."
        );
      } finally {
        setLoadingCourses(false);
      }

      return;
    }

    if (name === "courseId") {
      setBranches([]);
      setSemesters([]);
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        courseId: value,
        branchId: "",
        semesterId: "",
        subjectId: "",
      }));

      if (!value) return;

      try {
        setLoadingBranches(true);

        const response =
          await getBranches(value);

        setBranches(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load branches."
        );
      } finally {
        setLoadingBranches(false);
      }

      return;
    }

    if (name === "branchId") {
      setSemesters([]);
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        branchId: value,
        semesterId: "",
        subjectId: "",
      }));

      if (!value) return;

      try {
        setLoadingSemesters(true);

        const response =
          await getSemesters(value);

        setSemesters(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load semesters."
        );
      } finally {
        setLoadingSemesters(false);
      }

      return;
    }

    if (name === "semesterId") {
      setSubjects([]);

      setForm((previous) => ({
        ...previous,
        semesterId: value,
        subjectId: "",
      }));

      if (!value || !form.branchId) {
        return;
      }

      try {
        setLoadingSubjects(true);

        const response =
          await getSubjects(
            form.branchId,
            value
          );

        setSubjects(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load subjects."
        );
      } finally {
        setLoadingSubjects(false);
      }

      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.universityId ||
      !form.collegeId ||
      !form.facultyId ||
      !form.courseId ||
      !form.branchId ||
      !form.semesterId ||
      !form.subjectId
    ) {
      setError(
        "Please select the complete academic hierarchy."
      );
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Question paper title is required."
      );
      return;
    }

    if (!form.year) {
      setError("Year is required.");
      return;
    }

    if (!form.fileUrl.trim()) {
      setError("File URL is required.");
      return;
    }

    if (!form.fileName.trim()) {
      setError("File name is required.");
      return;
    }

    const payload = {
      universityId: form.universityId,
      collegeId: form.collegeId,
      facultyId: form.facultyId,
      courseId: form.courseId,
      branchId: form.branchId,
      semesterId: form.semesterId,
      subjectId: form.subjectId,

      title: form.title.trim(),
      examType: form.examType,
      year: Number(form.year),

      fileUrl: form.fileUrl.trim(),
      fileName: form.fileName.trim(),

      isPublished: form.isPublished,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await updateQuestionPaper(
          questionPaper._id,
          payload
        );
      } else {
        await createQuestionPaper(
          payload
        );
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(
        "Save Question Paper Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save question paper."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    py-2.5
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/10
    disabled:cursor-not-allowed
    disabled:bg-slate-50
  `;

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700";

  if (loadingInitial) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading question paper form...
          </p>
        </div>
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
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Academic Hierarchy */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Academic Information
            </h3>

            <p className="text-xs text-slate-500">
              Select the complete academic hierarchy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* University */}
          <div>
            <label className={labelClass}>
              University *
            </label>

            <select
              name="universityId"
              value={form.universityId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select University
              </option>

              {universities.map(
                (university) => (
                  <option
                    key={university._id}
                    value={university._id}
                  >
                    {university.name}
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
                !form.universityId ||
                loadingColleges
              }
              className={inputClass}
            >
              <option value="">
                {!form.universityId
                  ? "Select university first"
                  : loadingColleges
                    ? "Loading colleges..."
                    : "Select College"}
              </option>

              {colleges.map((college) => (
                <option
                  key={college._id}
                  value={college._id}
                >
                  {college.name}
                </option>
              ))}
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
              className={inputClass}
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
                </option>
              ))}
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
                !form.facultyId ||
                loadingCourses
              }
              className={inputClass}
            >
              <option value="">
                {!form.collegeId ||
                !form.facultyId
                  ? "Select college & faculty first"
                  : loadingCourses
                    ? "Loading courses..."
                    : "Select Course"}
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.name}
                </option>
              ))}
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
                !form.courseId ||
                loadingBranches
              }
              className={inputClass}
            >
              <option value="">
                {!form.courseId
                  ? "Select course first"
                  : loadingBranches
                    ? "Loading branches..."
                    : "Select Branch"}
              </option>

              {branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                >
                  {branch.name} (
                  {branch.code})
                </option>
              ))}
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
                !form.branchId ||
                loadingSemesters
              }
              className={inputClass}
            >
              <option value="">
                {!form.branchId
                  ? "Select branch first"
                  : loadingSemesters
                    ? "Loading semesters..."
                    : "Select Semester"}
              </option>

              {semesters.map(
                (semester) => (
                  <option
                    key={semester._id}
                    value={semester._id}
                  >
                    Semester{" "}
                    {semester.semesterNumber}
                    {semester.academicYear
                      ? ` - ${semester.academicYear}`
                      : ""}
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
                !form.semesterId ||
                loadingSubjects
              }
              className={inputClass}
            >
              <option value="">
                {!form.semesterId
                  ? "Select semester first"
                  : loadingSubjects
                    ? "Loading subjects..."
                    : "Select Subject"}
              </option>

              {subjects.map((subject) => (
                <option
                  key={subject._id}
                  value={subject._id}
                >
                  {subject.name} (
                  {subject.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Question Paper Details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="font-semibold text-slate-900">
            Question Paper Details
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Enter exam and question paper information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>
              Question Paper Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: Programming in C - Summer 2026"
              className={inputClass}
            />
          </div>

          {/* Exam Type */}
          <div>
            <label className={labelClass}>
              Exam Type *
            </label>

            <select
              name="examType"
              value={form.examType}
              onChange={handleChange}
              className={inputClass}
            >
              {examTypes.map((exam) => (
                <option
                  key={exam.value}
                  value={exam.value}
                >
                  {exam.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className={labelClass}>
              Year *
            </label>

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              placeholder="2026"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* File Information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LinkIcon size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              File Information
            </h3>

            <p className="text-xs text-slate-500">
              Add the publicly accessible question paper file URL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* File Name */}
          <div>
            <label className={labelClass}>
              File Name *
            </label>

            <input
              type="text"
              name="fileName"
              value={form.fileName}
              onChange={handleChange}
              placeholder="question-paper-2026.pdf"
              className={inputClass}
            />
          </div>

          {/* File URL */}
          <div>
            <label className={labelClass}>
              File URL *
            </label>

            <input
              type="url"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/question-paper.pdf"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Publish Question Paper
            </p>

            <p className="text-xs text-slate-500">
              Published papers will be visible to students.
            </p>
          </div>
        </label>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <X size={17} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            focus:outline-none
            focus:ring-4
            focus:ring-blue-500/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Save size={17} />

          {saving
            ? "Saving..."
            : isEditMode
              ? "Update Question Paper"
              : "Save Question Paper"}
        </button>
      </div>
    </form>
  );
}

export default QuestionPaperForm;

