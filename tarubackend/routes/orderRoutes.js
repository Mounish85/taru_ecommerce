const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  getInvoice,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create order
router.post(
  "/",
  authMiddleware,
  roleMiddleware("BUYER"),
  createOrder
);

// Get all orders of current buyer
router.get(
  "/",
  authMiddleware,
  roleMiddleware("BUYER"),
  getOrders
);

// Generate/download invoice
// Keep this BEFORE /:orderId
router.get(
  "/:orderId/invoice",
  authMiddleware,
  roleMiddleware("BUYER"),
  getInvoice
);

// Get individual order
router.get(
  "/:orderId",
  authMiddleware,
  roleMiddleware("BUYER"),
  getOrder
);

module.exports = router;