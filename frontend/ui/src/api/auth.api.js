import http from "./http";

export const signupRequest = (payload) => http.post("/api/auth/signup", payload);
export const loginRequest = (payload) => http.post("/api/auth/login", payload);
export const logoutRequest = () => http.post("/api/auth/logout", {});
export const checkAuthRequest = () => http.get("/api/auth/check");

export const updateProfileRequest = (formData) =>
  http.put("/api/auth/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
