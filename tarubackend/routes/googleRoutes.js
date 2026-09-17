const express = require("express");

const {
  googleAuth,
  googleCallback,
} = require("../controllers/googleController");

const router = express.Router();

// Start Google OAuth
router.get("/auth", googleAuth);

// Google redirects here after authorization
router.get("/callback", googleCallback);

module.exports = router;