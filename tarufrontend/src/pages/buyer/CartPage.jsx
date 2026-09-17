import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItemsCount } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/buyer/checkout" } } });
      return;
    }
    if (!isBuyer) {
      navigate("/unauthorized");
      return;
    }
    navigate("/buyer/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 border-2 border-[#1E1E1E] bg-[#ECEAE5] flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[#DB4A2B]" />
        </div>
        <h1 className="font-heading text-4xl uppercase tracking-tighter text-[#1E1E1E]">
          YOUR BAG IS EMPTY
        </h1>
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] max-w-md leading-relaxed">
          Support rural SHG artisans by browsing certified handcrafted works in our catalog.
        </p>
        <Link to="/buyer/products" className="btn-brutalist flex items-center gap-2 mt-4">
          <span>EXPLORE CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            CHECKOUT PIPELINE // STAGE 01
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            SHOPPING BAG ({totalItemsCount})
          </h1>
        </div>
        <Link
          to="/buyer/products"
          className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] divide-y divide-[#1E1E1E] shadow-[6px_6px_0px_#1E1E1E]">
            {items.map((item) => (
              <div
                key={item.productId}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 bg-[#D9D6D0] border border-[#1E1E1E] shrink-0 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-satoshi text-[10px] text-[#6B6A67]">TARU</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/buyer/products/${item.productId}`}
                        className="font-heading uppercase text-lg sm:text-xl font-bold text-[#1E1E1E] hover:text-[#FF89A9] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.productType === "UNIQUE" && (
                        <span className="px-2 py-0.5 text-[9px] font-satoshi uppercase tracking-widest font-bold bg-[#1E1E1E] text-[#E4E2DD]">
                          UNIQUE
                        </span>
                      )}
                    </div>
                    <div className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-1">
                      Unit Price: ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#1E1E1E] bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold bg-[#E4E2DD] hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-heading font-bold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.productType === "UNIQUE" || item.quantity >= item.maxStock}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold bg-[#E4E2DD] hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-heading text-lg font-bold text-[#1E1E1E] min-w-[80px] text-right">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-[#6B6A67] hover:text-[#DB4A2B] transition-colors"
                    title="Remove from Bag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-8 shadow-[6px_6px_0px_#1E1E1E] flex flex-col gap-6">
          <h2 className="font-heading text-2xl uppercase tracking-tighter text-[#1E1E1E] border-b border-[#1E1E1E] pb-4">
            SUMMARY BREAKDOWN
          </h2>

          <div className="flex flex-col gap-3 font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
            <div className="flex items-center justify-between">
              <span>Items Total:</span>
              <span className="text-[#1E1E1E] font-bold">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>SHG Direct Logistics:</span>
              <span className="text-green-800 font-bold">COMPLIMENTARY</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fair-Trade Verification:</span>
              <span className="text-green-800 font-bold">INCLUDED</span>
            </div>
          </div>

          <div className="border-t-2 border-[#1E1E1E] pt-4 flex items-baseline justify-between">
            <span className="font-heading text-xl uppercase tracking-tight text-[#1E1E1E]">
              TOTAL PAYABLE
            </span>
            <span className="font-heading text-3xl font-bold text-[#DB4A2B]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            onClick={handleCheckoutClick}
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            <span>PROCEED TO SHIPPING</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="font-satoshi text-[11px] uppercase tracking-widest text-[#6B6A67] text-center leading-relaxed">
            Direct artisan bank settlement. Real Google Drive invoice generated upon payment.
          </p>
        </div>
      </div>
    </div>
  );
}

