const express = require("express");

const {
  addProductInterest,
  getMyInterests,
} = require("../controllers/interestController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Record interest in a product
router.post(
  "/",
  authMiddleware,
  roleMiddleware("BUYER"),
  addProductInterest
);

// Get buyer's interests
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("BUYER"),
  getMyInterests
);

module.exports = router;