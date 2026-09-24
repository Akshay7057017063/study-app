
import api from "./api";

export const getCourses = async (
  collegeId = "",
  facultyId = ""
) => {
  const params = new URLSearchParams();

  if (collegeId) {
    params.append("collegeId", collegeId);
  }

  if (facultyId) {
    params.append("facultyId", facultyId);
  }

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(`/courses${query}`);
};

export const createCourse = async (courseData) => {
  return await api("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (
  id,
  courseData
) => {
  return await api(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (id) => {
  return await api(`/courses/${id}`, {
    method: "DELETE",
  });
};

