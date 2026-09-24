
import api from "./api";

export const getSemesters = async (branchId = "") => {
  const query = branchId
    ? `?branchId=${encodeURIComponent(branchId)}`
    : "";

  return await api(`/semesters${query}`);
};

export const createSemester = async (
  semesterData
) => {
  return await api("/semesters", {
    method: "POST",
    body: JSON.stringify(semesterData),
  });
};

export const updateSemester = async (
  id,
  semesterData
) => {
  return await api(`/semesters/${id}`, {
    method: "PUT",
    body: JSON.stringify(semesterData),
  });
};

export const deleteSemester = async (id) => {
  return await api(`/semesters/${id}`, {
    method: "DELETE",
  });
};

