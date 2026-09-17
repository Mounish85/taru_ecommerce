import api from "./api";

/**
 * Fetch all available products in the marketplace
 */
export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

/**
 * Fetch a single product by ID
 * @param {string} productId
 */
export async function getProduct(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

/**
 * Fetch products listed by the authenticated seller
 */
export async function getSellerProducts() {
  const response = await api.get("/products/seller/my-products");
  return response.data;
}

/**
 * Create a new product with optional image upload
 * @param {FormData} formData - Multipart form data containing name, description, price, quantity, category, productType, image
 */
export async function createProduct(formData) {
  // Do NOT manually set Content-Type header so the browser/Axios generates boundary
  const response = await api.post("/products", formData);
  return response.data;
}

/**
 * Update product fields
 * @param {string} productId
 * @param {Object} data
 */
export async function updateProduct(productId, data) {
  const response = await api.put(`/products/${productId}`, data);
  return response.data;
}

/**
 * Deactivate a product
 * @param {string} productId
 */
export async function deleteProduct(productId) {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
}

