const {
  createPaymentRecord,
  markPaymentSuccess,
  getPaymentByOrderId,
} = require("../services/paymentService");

const {
  findRow,
} = require("../services/googleSheetsService");

async function createPayment(req, res) {
  try {
    const {
      orderId,
      amount,
    } = req.body;

    if (!orderId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "orderId and amount are required.",
      });
    }

    const order =
      await findRow(
        "Orders",
        "orderId",
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.buyerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to pay for this order.",
      });
    }

    const payment =
      await createPaymentRecord(
        orderId,
        amount
      );

    res.status(201).json({
      success: true,
      message: "Payment record created.",
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function paymentSuccess(req, res) {
  try {
    const {
      orderId,
      transactionId,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required.",
      });
    }

    const order =
      await findRow(
        "Orders",
        "orderId",
        orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.buyerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this payment.",
      });
    }

    const payment =
      await markPaymentSuccess(
        orderId,
        transactionId
      );

    res.status(200).json({
      success: true,
      message: "Payment marked as successful.",
      payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getPayment(req, res) {
  try {
    const order =
      await findRow(
        "Orders",
        "orderId",
        req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.buyerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this payment.",
      });
    }

    const payment =
      await getPaymentByOrderId(
        req.params.orderId
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createPayment,
  paymentSuccess,
  getPayment,
};