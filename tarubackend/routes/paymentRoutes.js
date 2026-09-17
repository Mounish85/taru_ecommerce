const express = require("express");

const {
  createPayment,
  paymentSuccess,
  getPayment,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create payment record
router.post(
  "/",
  authMiddleware,
  roleMiddleware("BUYER"),
  createPayment
);

// Mark payment as successful
router.post(
  "/success",
  authMiddleware,
  roleMiddleware("BUYER"),
  paymentSuccess
);

// Get payment for an order
router.get(
  "/:orderId",
  authMiddleware,
  roleMiddleware("BUYER"),
  getPayment
);

module.exports = router;