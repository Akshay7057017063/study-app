
import api from "./api";

// Get all study materials
export const getMaterials = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(`/materials${query}`);
};

// Get material by ID
export const getMaterialById = async (id) => {
  return await api(`/materials/${id}`);
};

// Create material
export const createMaterial = async (materialData) => {
  return await api("/materials", {
    method: "POST",
    body: JSON.stringify(materialData),
  });
};

// Update material
export const updateMaterial = async (id, materialData) => {
  return await api(`/materials/${id}`, {
    method: "PUT",
    body: JSON.stringify(materialData),
  });
};

// Delete material
export const deleteMaterial = async (id) => {
  return await api(`/materials/${id}`, {
    method: "DELETE",
  });
};

