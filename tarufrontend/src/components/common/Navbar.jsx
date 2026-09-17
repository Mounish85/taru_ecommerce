import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, LogOut, Menu, X, Layers, Heart, Sparkles, Package, Truck, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const { user, isAuthenticated, isBuyer, isSeller, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#E4E2DD]/90 backdrop-blur-md border-b border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <Link
            to="/"
            className="flex flex-col group select-none"
          >
            <span className="font-heading text-2xl font-bold tracking-tighter uppercase leading-none text-[#1E1E1E] group-hover:text-[#DB4A2B] transition-colors">
              TARU
            </span>
            <span className="font-satoshi text-[11px] uppercase tracking-widest text-[#1E1E1E] font-medium leading-none mt-1">
              FOUNDATION
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-satoshi text-xs uppercase tracking-widest font-medium text-[#1E1E1E]">
            {/* Guest & Buyer Links */}
            {!isSeller && (
              <>
                <Link
                  to="/buyer/products"
                  className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                    isActive("/buyer/products") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                  }`}
                >
                  SHOP
                </Link>
                {isBuyer && (
                  <>
                    <Link
                      to="/buyer/recommendations"
                      className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                        isActive("/buyer/recommendations") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                      }`}
                    >
                      RECOMMENDATIONS
                    </Link>
                    <Link
                      to="/buyer/interests"
                      className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                        isActive("/buyer/interests") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                      }`}
                    >
                      INTERESTS
                    </Link>
                    <Link
                      to="/buyer/orders"
                      className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                        isActive("/buyer/orders") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                      }`}
                    >
                      ORDERS
                    </Link>
                  </>
                )}
                <a
                  href="/#about"
                  className="hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 border-transparent"
                >
                  MISSION
                </a>
              </>
            )}

            {/* Seller Links */}
            {isSeller && (
              <>
                <Link
                  to="/seller"
                  className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                    location.pathname === "/seller" ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                  }`}
                >
                  DASHBOARD
                </Link>
                <Link
                  to="/seller/products"
                  className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                    isActive("/seller/products") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                  }`}
                >
                  PRODUCTS
                </Link>
                <Link
                  to="/seller/products/new"
                  className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                    isActive("/seller/products/new") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                  }`}
                >
                  + ADD PRODUCT
                </Link>
                <Link
                  to="/seller/delivery"
                  className={`hover:text-[#DB4A2B] transition-colors pb-1 border-b-2 ${
                    isActive("/seller/delivery") ? "border-[#DB4A2B] text-[#DB4A2B]" : "border-transparent"
                  }`}
                >
                  DELIVERY
                </Link>
              </>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 p-2 font-satoshi text-xs uppercase tracking-widest text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
              <span className="hidden lg:inline">SEARCH</span>
            </button>

            {/* Bag (Buyer or Guest) */}
            {!isSeller && (
              <Link
                to="/buyer/cart"
                className="relative flex items-center gap-1.5 p-2 font-satoshi text-xs uppercase tracking-widest text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden lg:inline">BAG</span>
                {totalItemsCount > 0 && (
                  <span className="inline-flex items-center justify-center bg-[#DB4A2B] text-[#E4E2DD] text-[10px] font-bold w-5 h-5 rounded-none border border-[#1E1E1E]">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to={isSeller ? "/seller" : "/buyer"}
                  className="hidden sm:flex items-center gap-2 border border-[#1E1E1E] bg-[#ECEAE5] px-3 py-1.5 font-satoshi text-xs uppercase tracking-widest text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name?.split(" ")[0]} ({user?.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 border border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD] hover:bg-[#DB4A2B] hover:text-white transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-[#1E1E1E] bg-transparent text-xs font-satoshi uppercase tracking-widest font-medium hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD] text-xs font-satoshi uppercase tracking-widest font-medium hover:bg-[#DB4A2B] transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-[#1E1E1E] md:hidden hover:bg-[#ECEAE5] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E1E1E] bg-[#E4E2DD] px-4 py-6 flex flex-col gap-4 font-satoshi text-sm uppercase tracking-widest animate-slide-up">
            {!isSeller && (
              <>
                <Link
                  to="/buyer/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                >
                  <span>SHOP MARKETPLACE</span>
                  <Layers className="w-4 h-4" />
                </Link>
                {isBuyer && (
                  <>
                    <Link
                      to="/buyer/recommendations"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                    >
                      <span>RECOMMENDATIONS</span>
                      <Sparkles className="w-4 h-4 text-[#DB4A2B]" />
                    </Link>
                    <Link
                      to="/buyer/interests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                    >
                      <span>SAVED INTERESTS</span>
                      <Heart className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/buyer/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                    >
                      <span>ORDER HISTORY</span>
                      <Package className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </>
            )}

            {isSeller && (
              <>
                <Link
                  to="/seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                >
                  <span>SELLER DASHBOARD</span>
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                <Link
                  to="/seller/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                >
                  <span>MY INVENTORY</span>
                  <Package className="w-4 h-4" />
                </Link>
                <Link
                  to="/seller/products/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between text-[#DB4A2B]"
                >
                  <span>+ ADD NEW PRODUCT</span>
                </Link>
                <Link
                  to="/seller/delivery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#1E1E1E]/20 flex items-center justify-between"
                >
                  <span>DELIVERY MANAGEMENT</span>
                  <Truck className="w-4 h-4" />
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border border-[#1E1E1E] bg-[#ECEAE5] font-medium"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD] font-medium"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-3 border border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT ({user?.name})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

