const {
  createNewOrder,
  getBuyerOrders,
  getOrderById,
} = require("../services/orderService");

const {
  generateInvoice,
} = require("../services/invoiceService");

async function createOrder(req, res) {
  try {
    const {
      items,
      shippingAddress,
    } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one order item is required.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const result =
      await createNewOrder(
        req.user.userId,
        items,
        shippingAddress
      );

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: result.order,
      items: result.items,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrders(req, res) {
  try {
    const orders =
      await getBuyerOrders(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrder(req, res) {
  try {
    const result =
      await getOrderById(
        req.params.orderId
      );

    if (
      result.order.buyerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this order.",
      });
    }

    res.status(200).json({
      success: true,
      order: result.order,
      items: result.items,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function getInvoice(req, res) {
  try {
    const result =
      await getOrderById(
        req.params.orderId
      );

    if (
      result.order.buyerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this invoice.",
      });
    }

    const invoice =
      await generateInvoice(
        req.params.orderId
      );

    res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  getInvoice,
};