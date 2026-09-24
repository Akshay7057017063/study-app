
import api from "./api";

export const getBranches = async (courseId = "") => {
  const query = courseId
    ? `?courseId=${encodeURIComponent(courseId)}`
    : "";

  return await api(`/branches${query}`);
};

export const createBranch = async (branchData) => {
  return await api("/branches", {
    method: "POST",
    body: JSON.stringify(branchData),
  });
};

export const updateBranch = async (
  id,
  branchData
) => {
  return await api(`/branches/${id}`, {
    method: "PUT",
    body: JSON.stringify(branchData),
  });
};

export const deleteBranch = async (id) => {
  return await api(`/branches/${id}`, {
    method: "DELETE",
  });
};

