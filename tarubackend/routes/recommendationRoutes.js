const express = require("express");

const {
  getMyRecommendations,
} = require("../controllers/recommendationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("BUYER"),
  getMyRecommendations
);

module.exports = router;