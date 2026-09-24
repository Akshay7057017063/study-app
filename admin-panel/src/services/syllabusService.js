
import api from "./api";

// Get all syllabus with optional filters
export const getSyllabus = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, value);
    }
  });

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(`/syllabus${query}`);
};

// Get syllabus by ID
export const getSyllabusById = async (id) => {
  return await api(`/syllabus/${id}`);
};

// Create syllabus
export const createSyllabus = async (syllabusData) => {
  return await api("/syllabus", {
    method: "POST",
    body: JSON.stringify(syllabusData),
  });
};

// Update syllabus
export const updateSyllabus = async (
  id,
  syllabusData
) => {
  return await api(`/syllabus/${id}`, {
    method: "PUT",
    body: JSON.stringify(syllabusData),
  });
};

// Delete syllabus
export const deleteSyllabus = async (id) => {
  return await api(`/syllabus/${id}`, {
    method: "DELETE",
  });
};

