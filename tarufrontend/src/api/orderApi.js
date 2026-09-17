import api from "./api";

/**
 * Create a new order
 * @param {Object} orderData - { items: Array<{ productId, quantity }>, shippingAddress: string }
 */
export async function createOrder(orderData) {
  const response = await api.post("/orders", orderData);
  return response.data;
}

/**
 * Get all orders placed by the authenticated buyer
 */
export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

/**
 * Get a specific order by ID
 * @param {string} orderId
 */
export async function getOrder(orderId) {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
}

/**
 * Get the Google Drive invoice generated for an order
 * @param {string} orderId
 */
export async function getInvoice(orderId) {
  const response = await api.get(`/orders/${orderId}/invoice`);
  return response.data;
}

