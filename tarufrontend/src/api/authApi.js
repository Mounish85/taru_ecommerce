import api from "./api";

/**
 * Register a new user (BUYER or SELLER)
 * @param {Object} userData - { name, email, password, role, organizationName?, description?, contactInfo? }
 */
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}

/**
 * Log in a user (sets HTTP-only cookie)
 * @param {Object} credentials - { email, password }
 */
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

/**
 * Log out the current user (clears HTTP-only cookie)
 */
export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

/**
 * Get the currently authenticated user's session profile
 */
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

