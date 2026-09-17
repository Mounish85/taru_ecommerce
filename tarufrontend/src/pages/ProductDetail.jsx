import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import Button from "../components/common/Button";
import { getProduct } from "../api/productApi";
import { addProductInterest } from "../api/interestApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestSaved, setInterestSaved] = useState(false);

  const { isAuthenticated, isBuyer } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProduct(productId)
      .then((res) => {
        if (mounted && res?.product) {
          setProduct(res.product);
        }
      })
      .catch((err) => {
        if (mounted) {
          toast.error(err.customMessage || "Product not found.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse flex flex-col gap-8">
        <div className="h-6 w-32 bg-[#D9D6D0]" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6 aspect-[3/4] bg-[#D9D6D0] border border-[#1E1E1E]" />
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="h-12 bg-[#D9D6D0] w-3/4" />
            <div className="h-8 bg-[#D9D6D0] w-1/4" />
            <div className="h-24 bg-[#D9D6D0] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-tight text-[#1E1E1E]">
          Creation Not Located
        </h2>
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2 mb-6">
          The requested artisan product may have been unlisted or removed.
        </p>
        <Link to="/buyer/products" className="btn-brutalist">
          ← Return to Marketplace
        </Link>
      </div>
    );
  }

  const isUnique = product.productType === "UNIQUE";
  const isSold = product.status === "SOLD" || Number(product.quantity) === 0;
  const isInactive = product.status === "INACTIVE";

  const handleInterest = async () => {
    if (!isAuthenticated) {
      toast.info("Please login as a buyer to save your interests.");
      navigate("/login");
      return;
    }
    if (!isBuyer) {
      toast.info("Only buyers can save product interests.");
      return;
    }

    setInterestLoading(true);
    try {
      await addProductInterest(product.productId);
      setInterestSaved(true);
      toast.success(`Marked "${product.name}" in your interest registry!`);
    } catch (err) {
      toast.error(err.customMessage || "Failed to record interest.");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (isSold || isInactive) {
      toast.error("This item is unavailable for purchase.");
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          to="/buyer/products"
          className="inline-flex items-center gap-2 font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace Catalog</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Presentation (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full border-2 border-[#1E1E1E] bg-[#D9D6D0] overflow-hidden shadow-[8px_8px_0px_#1E1E1E]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#ECEAE5] text-center">
                <span className="font-heading text-3xl uppercase tracking-tighter text-[#1E1E1E]/40">
                  TARU MASTERPIECE
                </span>
                <span className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-3">
                  Rural SHG Authentic Craft
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isUnique && (
                <span className="px-3 py-1.5 bg-[#1E1E1E] text-[#E4E2DD] text-xs font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E]">
                  1-OF-1 UNIQUE MASTERWORK
                </span>
              )}
              {isSold && (
                <span className="px-3 py-1.5 bg-[#DB4A2B] text-[#E4E2DD] text-xs font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E] shadow-[3px_3px_0px_#1E1E1E]">
                  {isUnique ? "SOLD — UNIQUE ITEM (ARCHIVED)" : "CURRENTLY SOLD OUT"}
                </span>
              )}
            </div>
          </div>

          <div className="border border-[#1E1E1E] bg-[#ECEAE5] p-4 flex items-center justify-between text-xs font-satoshi uppercase tracking-widest text-[#6B6A67]">
            <span>VERIFIED SHG PRODUCTION</span>
            <span>GOOGLE DRIVE MEDIA ASSET</span>
          </div>
        </div>

        {/* Right Column: Metadata & Purchase Box (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-8">
          {/* Header & Title */}
          <div className="border-b border-[#1E1E1E] pb-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-satoshi text-xs uppercase tracking-widest text-[#DB4A2B] font-bold">
              <span>{product.category || "General Handcraft"}</span>
              <span>//</span>
              <span>TYPE: {product.productType}</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.9] text-[#1E1E1E]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-[#1E1E1E]">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
                INCLUSIVE OF ALL APPLICABLE TAXES
              </span>
            </div>
          </div>

          {/* Narrative / Description */}
          <div className="flex flex-col gap-2">
            <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E]">
              ARTISAN NARRATIVE
            </span>
            <p className="font-satoshi text-base text-[#1E1E1E] leading-relaxed whitespace-pre-line bg-[#ECEAE5] p-6 border border-[#1E1E1E]">
              {product.description || "This piece was handcrafted by rural Self Help Group artisans using indigenous materials and age-old traditional craftsmanship passed down through generations."}
            </p>
          </div>

          {/* Inventory & Actions */}
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 flex flex-col gap-6 shadow-[4px_4px_0px_#1E1E1E]">
            <div className="flex items-center justify-between font-satoshi text-xs uppercase tracking-widest">
              <span className="text-[#6B6A67]">INVENTORY STATUS:</span>
              <span className={`font-bold ${isSold ? "text-[#DB4A2B]" : "text-green-800"}`}>
                {isSold
                  ? isUnique ? "SOLD (UNIQUE ARCHIVE RECORD)" : "OUT OF STOCK"
                  : `${product.quantity} UNIT(S) AVAILABLE`}
              </span>
            </div>

            {/* Quantity Selector (Only if available and regular) */}
            {!isSold && !isUnique && (
              <div className="flex items-center justify-between border-t border-[#1E1E1E]/30 pt-4">
                <span className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E]">
                  PURCHASE QUANTITY:
                </span>
                <div className="flex items-center border border-[#1E1E1E]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold bg-[#E4E2DD] hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-heading font-bold text-base bg-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(Number(product.quantity), q + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center font-bold bg-[#E4E2DD] hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isSold || isInactive}
                variant="primary"
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isSold
                    ? isUnique ? "SOLD — ARCHIVED" : "OUT OF STOCK"
                    : "ADD TO SHOPPING BAG"}
                </span>
              </Button>

              <button
                onClick={handleInterest}
                disabled={interestLoading}
                className={`px-6 py-3.5 border border-[#1E1E1E] font-satoshi text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                  interestSaved
                    ? "bg-[#DB4A2B] text-white"
                    : "bg-[#E4E2DD] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#E4E2DD]"
                }`}
                title="Save to Interests"
              >
                <Heart className={`w-4 h-4 ${interestSaved ? "fill-current" : ""}`} />
                <span>{interestSaved ? "INTEREST RECORDED" : "INTERESTED"}</span>
              </button>
            </div>
          </div>

          {/* Taru Guarantee */}
          <div className="flex items-start gap-4 border border-[#1E1E1E] p-4 bg-white/40">
            <ShieldCheck className="w-6 h-6 text-[#DB4A2B] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                TARU FOUNDATION DIRECT FAIR-TRADE PROMISE
              </span>
              <p className="font-satoshi text-xs text-[#6B6A67] leading-relaxed">
                Guaranteed rural SHG direct purchase. Real Google Drive invoice generated upon order completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

