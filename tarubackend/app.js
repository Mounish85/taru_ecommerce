require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  initializeDatabase,
} = require("./services/googleSheetsService");

// Routes
const authRoutes = require("./routes/authRoutes");
const googleRoutes = require("./routes/googleRoutes");
const productRoutes = require("./routes/productRoutes");
const interestRoutes = require("./routes/interestRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse cookies
app.use(morgan('dev'));
// Required by authMiddleware to read JWT cookie
app.use(cookieParser());
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/taru/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Taru Foundation backend is running",
  });
});

// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use("/taru/auth", authRoutes);

// Google Drive OAuth
app.use("/taru/google", googleRoutes);

// Products
app.use("/taru/products", productRoutes);

// Product interests
app.use("/taru/interests", interestRoutes);

// Recommendations
app.use("/taru/recommendations", recommendationRoutes);

// Orders
app.use("/taru/orders", orderRoutes);

// Payments
app.use("/taru/payments", paymentRoutes);

// Delivery
app.use("/taru/delivery", deliveryRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize Google Sheets database
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(
        `Taru Foundation backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start Taru Foundation backend:"
    );

    console.error(error.message);

    process.exit(1);
  }
}

startServer();