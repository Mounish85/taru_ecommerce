const crypto = require("crypto");

const {
  appendRow,
  findRow,
  findRows,
} = require("./googleSheetsService");

const {
  createOrder,
  validateOrder,
} = require("../models/Order");

const {
  createOrderItem,
  validateOrderItem,
} = require("../models/OrderItem");

const {
  reduceProductQuantity,
} = require("./productService");

function generateId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function createNewOrder(
  buyerId,
  items,
  shippingAddress
) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "At least one product is required."
    );
  }

  const orderId = generateId("ORD");
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await findRow(
      "Products",
      "productId",
      item.productId
    );

    if (!product) {
      throw new Error(
        `Product ${item.productId} not found.`
      );
    }

    const quantity = Number(item.quantity);

    if (
      product.status !== "AVAILABLE" ||
      Number(product.quantity) < quantity
    ) {
      throw new Error(
        `Insufficient stock for ${product.name}.`
      );
    }

    const unitPrice = Number(product.price);

    totalAmount += unitPrice * quantity;

    const orderItem = createOrderItem({
      orderItemId: generateId("ITEM"),
      orderId,
      productId: product.productId,
      quantity,
      unitPrice,
    });

    validateOrderItem(orderItem);

    orderItems.push(orderItem);
  }

  const order = createOrder({
    orderId,
    buyerId,
    totalAmount,
    status: "PENDING",
    shippingAddress,
  });

  validateOrder(order);

  await appendRow("Orders", order);

  for (const orderItem of orderItems) {
    orderItem.orderId = orderId;

    await appendRow(
      "OrderItems",
      orderItem
    );

    await reduceProductQuantity(
      orderItem.productId,
      orderItem.quantity
    );
  }

  return {
    order,
    items: orderItems,
  };
}

async function getBuyerOrders(buyerId) {
  return findRows(
    "Orders",
    "buyerId",
    buyerId
  );
}

async function getOrderById(orderId) {
  const order = await findRow(
    "Orders",
    "orderId",
    orderId
  );

  if (!order) {
    throw new Error("Order not found.");
  }

  const items = await findRows(
    "OrderItems",
    "orderId",
    orderId
  );

  return {
    order,
    items,
  };
}

module.exports = {
  createNewOrder,
  getBuyerOrders,
  getOrderById,
};