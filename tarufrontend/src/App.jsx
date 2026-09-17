import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-[#E4E2DD] text-[#1E1E1E] selection:bg-[#DB4A2B] selection:text-[#E4E2DD]">
              {/* Sticky Brutalist Navigation */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-1">
                <AppRoutes />
              </main>

              {/* Editorial Footer */}
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
