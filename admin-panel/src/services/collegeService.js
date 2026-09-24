
import api from "./api";

export const getColleges = async (universityId = "") => {
  const query = universityId
    ? `?universityId=${encodeURIComponent(universityId)}`
    : "";

  return await api(`/colleges${query}`);
};

export const createCollege = async (collegeData) => {
  return await api("/colleges", {
    method: "POST",
    body: JSON.stringify(collegeData),
  });
};

export const updateCollege = async (id, collegeData) => {
  return await api(`/colleges/${id}`, {
    method: "PUT",
    body: JSON.stringify(collegeData),
  });
};

export const deleteCollege = async (id) => {
  return await api(`/colleges/${id}`, {
    method: "DELETE",
  });
};

