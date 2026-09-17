const crypto = require("crypto");

const {
  appendRow,
  findRow,
  updateRow,
} = require("./googleSheetsService");

const {
  createPayment,
  validatePayment,
} = require("../models/Payment");

function generateId() {
  return `PAY_${crypto.randomUUID()}`;
}

function generateTransactionId() {
  return `TXN_${crypto.randomUUID()}`;
}

async function createPaymentRecord(
  orderId,
  amount
) {
  const order = await findRow(
    "Orders",
    "orderId",
    orderId
  );

  if (!order) {
    throw new Error("Order not found.");
  }

  const existingPayment = await findRow(
    "Payments",
    "orderId",
    orderId
  );

  if (existingPayment) {
    return existingPayment;
  }

  const payment = createPayment({
    paymentId: generateId(),
    orderId,
    amount,
    status: "PENDING",
    transactionId: "",
    paidAt: "",
  });

  validatePayment(payment);

  await appendRow("Payments", payment);

  return payment;
}

async function markPaymentSuccess(
  orderId,
  transactionId
) {
  const payment = await findRow(
    "Payments",
    "orderId",
    orderId
  );

  if (!payment) {
    throw new Error("Payment not found.");
  }

  payment.status = "SUCCESS";
  payment.transactionId =
    transactionId || generateTransactionId();
  payment.paidAt =
    new Date().toISOString();

  const { _rowNumber, ...data } = payment;

  await updateRow(
    "Payments",
    _rowNumber,
    data
  );

  return data;
}

async function getPaymentByOrderId(orderId) {
  return findRow(
    "Payments",
    "orderId",
    orderId
  );
}

module.exports = {
  createPaymentRecord,
  markPaymentSuccess,
  getPaymentByOrderId,
};