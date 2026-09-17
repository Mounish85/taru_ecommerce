const express = require("express");
const multer = require("multer");

const {
  createProduct,
  getProducts,
  getProduct,
  getMyProducts,
  updateProductController,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Public routes
router.get("/", getProducts);

router.get("/:productId", getProduct);

// Seller-only route
// IMPORTANT: keep this before /:productId
router.get(
  "/seller/my-products",
  authMiddleware,
  roleMiddleware("SELLER"),
  getMyProducts
);

// Create product
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SELLER"),
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:productId",
  authMiddleware,
  roleMiddleware("SELLER"),
  updateProductController
);

// Deactivate product
router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("SELLER"),
  deleteProduct
);

module.exports = router;