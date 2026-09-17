import api from "./api";

/**
 * Seller creates an initial delivery record for an order
 * @param {Object} data - { orderId: string, address: string }
 */
export async function createDelivery(data) {
  const response = await api.post("/delivery", data);
  return response.data;
}

/**
 * Get delivery tracking information for an order
 * @param {string} orderId
 */
export async function getDelivery(orderId) {
  const response = await api.get(`/delivery/${orderId}`);
  return response.data;
}

/**
 * Seller updates the delivery status of an order
 * @param {string} orderId
 * @param {string} status - PENDING, PROCESSING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED
 */
export async function updateDelivery(orderId, status) {
  const response = await api.patch(`/delivery/${orderId}`, { status });
  return response.data;
}

