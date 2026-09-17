const {
  createDeliveryRecord,
  getDelivery,
  updateDeliveryStatus,
} = require("../services/deliveryService");

const {
  findRow,
} = require("../services/googleSheetsService");

async function createDelivery(req, res) {
  try {
    const {
      orderId,
      address,
    } = req.body;

    if (!orderId || !address) {
      return res.status(400).json({
        success: false,
        message:
          "orderId and address are required.",
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

    const delivery =
      await createDeliveryRecord(
        orderId,
        address
      );

    res.status(201).json({
      success: true,
      message:
        "Delivery record created.",
      delivery,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrderDelivery(
  req,
  res
) {
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
          "You are not authorized to view this delivery.",
      });
    }

    const delivery =
      await getDelivery(
        req.params.orderId
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found.",
      });
    }

    res.status(200).json({
      success: true,
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateDelivery(
  req,
  res
) {
  try {
    const {
      status,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required.",
      });
    }

    const delivery =
      await updateDeliveryStatus(
        req.params.orderId,
        status
      );

    res.status(200).json({
      success: true,
      message:
        "Delivery status updated.",
      delivery,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createDelivery,
  getOrderDelivery,
  updateDelivery,
};