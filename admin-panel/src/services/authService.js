import api from "./api";

export const loginAdmin = async (email, password) => {
  return await api("/admin/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};