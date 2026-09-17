const crypto = require("crypto");

const {
  appendRow,
  findRow,
  updateRow,
} = require("./googleSheetsService");

const {
  createDelivery,
  validateDelivery,
} = require("../models/Delivery");

function generateId() {
  return `DEL_${crypto.randomUUID()}`;
}

function generateTrackingId() {
  return `TRK_${crypto.randomUUID()
    .replace(/-/g, "")
    .substring(0, 12)
    .toUpperCase()}`;
}

async function createDeliveryRecord(
  orderId,
  address
) {
  const order = await findRow(
    "Orders",
    "orderId",
    orderId
  );

  if (!order) {
    throw new Error("Order not found.");
  }

  const existingDelivery = await findRow(
    "Deliveries",
    "orderId",
    orderId
  );

  if (existingDelivery) {
    return existingDelivery;
  }

  const delivery = createDelivery({
    deliveryId: generateId(),
    orderId,
    address,
    status: "PENDING",
    trackingId: generateTrackingId(),
  });

  validateDelivery(delivery);

  await appendRow(
    "Deliveries",
    delivery
  );

  return delivery;
}

async function getDelivery(orderId) {
  return findRow(
    "Deliveries",
    "orderId",
    orderId
  );
}

async function updateDeliveryStatus(
  orderId,
  status
) {
  const delivery = await findRow(
    "Deliveries",
    "orderId",
    orderId
  );

  if (!delivery) {
    throw new Error("Delivery not found.");
  }

  delivery.status = status;
  delivery.updatedAt =
    new Date().toISOString();

  const { _rowNumber, ...data } = delivery;

  validateDelivery(data);

  await updateRow(
    "Deliveries",
    _rowNumber,
    data
  );

  return data;
}

module.exports = {
  createDeliveryRecord,
  getDelivery,
  updateDeliveryStatus,
};