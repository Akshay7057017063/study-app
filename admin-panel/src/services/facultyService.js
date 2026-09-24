
import api from "./api";

export const getFaculties = async () => {
  return await api("/faculties");
};

export const createFaculty = async (facultyData) => {
  return await api("/faculties", {
    method: "POST",
    body: JSON.stringify(facultyData),
  });
};

export const updateFaculty = async (id, facultyData) => {
  return await api(`/faculties/${id}`, {
    method: "PUT",
    body: JSON.stringify(facultyData),
  });
};

export const deleteFaculty = async (id) => {
  return await api(`/faculties/${id}`, {
    method: "DELETE",
  });
};

