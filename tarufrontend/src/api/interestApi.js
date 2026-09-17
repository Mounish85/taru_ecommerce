import api from "./api";

/**
 * Express interest in a product
 * @param {string} productId
 */
export async function addProductInterest(productId) {
  const response = await api.post("/interests", { productId });
  return response.data;
}

/**
 * Fetch all products the authenticated buyer is interested in
 */
export async function getMyInterests() {
  const response = await api.get("/interests/me");
  return response.data;
}

