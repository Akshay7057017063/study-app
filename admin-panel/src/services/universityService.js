
import api from "./api";

export const getUniversities = async () => {
  return await api("/universities");
};

export const createUniversity = async (universityData) => {
  return await api("/universities", {
    method: "POST",
    body: JSON.stringify(universityData),
  });
};

export const updateUniversity = async (id, universityData) => {
  return await api(`/universities/${id}`, {
    method: "PUT",
    body: JSON.stringify(universityData),
  });
};

export const deleteUniversity = async (id) => {
  return await api(`/universities/${id}`, {
    method: "DELETE",
  });
};

