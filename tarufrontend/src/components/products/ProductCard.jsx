import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { addProductInterest } from "../../api/interestApi";

export default function ProductCard({ product, onInterestAdded }) {
  const { isBuyer, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [interestLoading, setInterestLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const isUnique = product.productType === "UNIQUE";
  const isSoldUnique = isUnique && (product.status === "SOLD" || Number(product.quantity) === 0);
  const isSoldRegular = !isUnique && (product.status === "SOLD" || Number(product.quantity) === 0);
  const isInactive = product.status === "INACTIVE";

  const handleInterestClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login as a buyer to save interests.");
      return;
    }
    if (!isBuyer) {
      toast.info("Only buyers can save product interests.");
      return;
    }

    setInterestLoading(true);
    try {
      await addProductInterest(product.productId);
      setIsInterested(true);
      toast.success(`Marked "${product.name}" as interested!`);
      if (onInterestAdded) onInterestAdded(product.productId);
    } catch (err) {
      toast.error(err.customMessage || "Failed to record interest");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldUnique || isSoldRegular || isInactive) {
      toast.error("This item is currently not available for purchase.");
      return;
    }

    addToCart(product, 1);
  };

  return (
    <div className="group flex flex-col w-full">
      {/* 3:4 Aspect Ratio Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#D9D6D0] border border-[#1E1E1E] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-brutalist group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Tasteful brutalist fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#ECEAE5]">
            <span className="font-heading text-xl uppercase tracking-tighter text-[#1E1E1E]/40">
              TARU ARCHIVE
            </span>
            <span className="font-satoshi text-[10px] uppercase tracking-widest text-[#6B6A67] mt-2">
              Rural Craftsmanship
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isUnique && (
            <span className="px-2.5 py-1 bg-[#1E1E1E] text-[#E4E2DD] text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E]">
              1-OF-1 UNIQUE
            </span>
          )}

          {isSoldUnique && (
            <span className="px-2.5 py-1 bg-[#DB4A2B] text-[#E4E2DD] text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E] shadow-[2px_2px_0px_#1E1E1E]">
              SOLD — UNIQUE ITEM
            </span>
          )}

          {isSoldRegular && (
            <span className="px-2.5 py-1 bg-[#1E1E1E] text-[#FF89A9] text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E]">
              SOLD OUT
            </span>
          )}

          {isInactive && (
            <span className="px-2.5 py-1 bg-[#6B6A67] text-[#E4E2DD] text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E]">
              INACTIVE
            </span>
          )}
        </div>

        {/* Top Right: Interest Button */}
        {isBuyer && (
          <button
            onClick={handleInterestClick}
            disabled={interestLoading}
            className={`absolute top-3 right-3 z-10 p-2.5 border border-[#1E1E1E] transition-colors ${
              isInterested
                ? "bg-[#DB4A2B] text-white"
                : "bg-[#E4E2DD]/90 text-[#1E1E1E] hover:bg-[#DB4A2B] hover:text-white"
            }`}
            title="Express Interest"
            aria-label="Save Interest"
          >
            <Heart className={`w-4 h-4 ${isInterested ? "fill-current" : ""}`} />
          </button>
        )}

        {/* Bottom Hover Action Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <Link
            to={`/buyer/products/${product.productId}`}
            className="flex-1 py-2 px-3 bg-[#E4E2DD] text-[#1E1E1E] border border-[#1E1E1E] font-satoshi text-xs uppercase tracking-widest font-bold text-center hover:bg-white transition-colors"
          >
            Details
          </Link>
          {!isSoldUnique && !isSoldRegular && !isInactive && (
            <button
              onClick={handleAddToCart}
              className="py-2 px-3 bg-[#DB4A2B] text-[#E4E2DD] border border-[#1E1E1E] font-satoshi text-xs uppercase tracking-widest font-bold hover:bg-[#1E1E1E] transition-colors flex items-center gap-1"
              title="Add to Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Bag</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-4 flex flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            to={`/buyer/products/${product.productId}`}
            className="font-heading uppercase text-lg sm:text-xl font-bold tracking-tight text-[#1E1E1E] group-hover:text-[#FF89A9] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <span className="font-satoshi text-sm sm:text-base font-semibold text-[#444444] shrink-0">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1 text-xs font-satoshi uppercase tracking-widest text-[#6B6A67]">
          <span>{product.category || "Artisan Craft"}</span>
          <span>
            {isUnique
              ? isSoldUnique ? "ARCHIVE ITEM" : "SINGLE EDITION"
              : `${product.quantity} in stock`}
          </span>
        </div>
      </div>
    </div>
  );
}

