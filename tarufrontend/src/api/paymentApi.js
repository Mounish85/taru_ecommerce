import api from "./api";

/**
 * Initialize a payment record for an order
 * @param {Object} data - { orderId: string, amount: number }
 */
export async function createPayment(data) {
  const response = await api.post("/payments", data);
  return response.data;
}

/**
 * Record a successful payment transaction
 * @param {Object} data - { orderId: string, transactionId: string }
 */
export async function paymentSuccess(data) {
  const response = await api.post("/payments/success", data);
  return response.data;
}

/**
 * Get payment details for an order
 * @param {string} orderId
 */
export async function getPayment(orderId) {
  const response = await api.get(`/payments/${orderId}`);
  return response.data;
}

