const express = require("express");

const {
  createDelivery,
  getOrderDelivery,
  updateDelivery,
} = require("../controllers/deliveryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Seller creates delivery record
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SELLER"),
  createDelivery
);

// Buyer or seller can view delivery
router.get(
  "/:orderId",
  authMiddleware,
  roleMiddleware("BUYER", "SELLER"),
  getOrderDelivery
);

// Seller updates delivery status
router.patch(
  "/:orderId",
  authMiddleware,
  roleMiddleware("SELLER"),
  updateDelivery
);

module.exports = router;