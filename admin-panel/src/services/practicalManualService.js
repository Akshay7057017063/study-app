
import api from "./api";

// Get all practical manuals with optional filters
export const getPracticalManuals = async (
  filters = {}
) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, value);
      }
    }
  );

  const query = params.toString()
    ? `?${params.toString()}`
    : "";

  return await api(
    `/practical-manuals${query}`
  );
};

// Get practical manual by ID
export const getPracticalManualById = async (
  id
) => {
  return await api(
    `/practical-manuals/${id}`
  );
};

// Create practical manual
export const createPracticalManual = async (
  manualData
) => {
  return await api("/practical-manuals", {
    method: "POST",
    body: JSON.stringify(manualData),
  });
};

// Update practical manual
export const updatePracticalManual = async (
  id,
  manualData
) => {
  return await api(
    `/practical-manuals/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(manualData),
    }
  );
};

// Delete practical manual
export const deletePracticalManual = async (
  id
) => {
  return await api(
    `/practical-manuals/${id}`,
    {
      method: "DELETE",
    }
  );
};
