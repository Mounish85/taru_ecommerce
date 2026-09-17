import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Public & Auth Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

// Buyer Pages
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import ProductsPage from "../pages/buyer/ProductsPage";
import CartPage from "../pages/buyer/CartPage";
import CheckoutPage from "../pages/buyer/CheckoutPage";
import RecommendationsPage from "../pages/buyer/RecommendationsPage";
import InterestsPage from "../pages/buyer/InterestsPage";
import OrdersPage from "../pages/buyer/OrdersPage";
import OrderDetailPage from "../pages/buyer/OrderDetailPage";

// Seller Pages
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProductsPage from "../pages/seller/SellerProductsPage";
import AddProductPage from "../pages/seller/AddProductPage";
import EditProductPage from "../pages/seller/EditProductPage";
import DeliveryManagementPage from "../pages/seller/DeliveryManagementPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Public & Buyer Browsing */}
      <Route path="/buyer/products" element={<ProductsPage />} />
      <Route path="/buyer/products/:productId" element={<ProductDetail />} />
      <Route path="/buyer/cart" element={<CartPage />} />

      {/* Buyer Protected Routes */}
      <Route
        path="/buyer"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <BuyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/checkout"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/recommendations"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <RecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/interests"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <InterestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/orders"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/orders/:orderId"
        element={
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Seller Protected Routes */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <SellerProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <AddProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:productId/edit"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <EditProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/delivery"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <DeliveryManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

