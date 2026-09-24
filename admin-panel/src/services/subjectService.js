
import api from "./api";

// Get all subjects
export const getSubjects = async (branchId = "", semesterId = "") => {
  const params = new URLSearchParams();

  if (branchId) {
    params.append("branchId", branchId);
  }

  if (semesterId) {
    params.append("semesterId", semesterId);
  }

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(`/subjects${query}`);
};

// Get subject by ID
export const getSubjectById = async (id) => {
  return await api(`/subjects/${id}`);
};

// Create subject
export const createSubject = async (subjectData) => {
  return await api("/subjects", {
    method: "POST",
    body: JSON.stringify(subjectData),
  });
};

// Update subject
export const updateSubject = async (id, subjectData) => {
  return await api(`/subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(subjectData),
  });
};

// Delete subject
export const deleteSubject = async (id) => {
  return await api(`/subjects/${id}`, {
    method: "DELETE",
  });
};

