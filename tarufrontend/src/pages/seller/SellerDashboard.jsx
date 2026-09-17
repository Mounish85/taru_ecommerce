import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Package, Truck, Layers, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getSellerProducts } from "../../api/productApi";
import Button from "../../components/common/Button";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getSellerProducts()
      .then((res) => {
        if (mounted && res?.products) {
          setProducts(res.products);
        }
      })
      .catch((err) => console.error("Error loading seller inventory:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "AVAILABLE").length;
  const soldProducts = products.filter((p) => p.status === "SOLD" || Number(p.quantity) === 0).length;
  const uniqueProducts = products.filter((p) => p.productType === "UNIQUE").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            SHG ARTISAN COMMAND CENTER
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            SELLER DASHBOARD
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Producer: {user?.name?.toUpperCase()} • Seller ID: {user?.userId}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/seller/products/new"
            className="btn-brutalist flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>LIST NEW PRODUCT</span>
          </Link>
          <Link
            to="/seller/delivery"
            className="btn-brutalist-outline flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>MANAGE DISPATCHES</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
            TOTAL CATALOGUE
          </span>
          <div className="mt-4 font-heading text-5xl font-bold text-[#1E1E1E]">
            {loading ? "..." : totalProducts}
          </div>
          <div className="text-[11px] font-satoshi uppercase tracking-widest text-[#6B6A67] mt-2">
            Uploaded items
          </div>
        </div>

        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
            ACTIVE IN MARKETPLACE
          </span>
          <div className="mt-4 font-heading text-5xl font-bold text-green-800">
            {loading ? "..." : activeProducts}
          </div>
          <div className="text-[11px] font-satoshi uppercase tracking-widest text-[#6B6A67] mt-2">
            Ready for purchase
          </div>
        </div>

        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
            SOLD OUT / ARCHIVED
          </span>
          <div className="mt-4 font-heading text-5xl font-bold text-[#DB4A2B]">
            {loading ? "..." : soldProducts}
          </div>
          <div className="text-[11px] font-satoshi uppercase tracking-widest text-[#6B6A67] mt-2">
            Depleted stock
          </div>
        </div>

        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
            1-OF-1 UNIQUE PIECES
          </span>
          <div className="mt-4 font-heading text-5xl font-bold text-[#1E1E1E]">
            {loading ? "..." : uniqueProducts}
          </div>
          <div className="text-[11px] font-satoshi uppercase tracking-widest text-[#6B6A67] mt-2">
            Artisan exclusives
          </div>
        </div>
      </div>

      {/* Recent Inventory Section */}
      <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-8 shadow-[6px_6px_0px_#1E1E1E]">
        <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4 mb-6">
          <h2 className="font-heading text-2xl uppercase tracking-tighter text-[#1E1E1E]">
            CURRENT INVENTORY SPOTLIGHT
          </h2>
          <Link
            to="/seller/products"
            className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] hover:underline flex items-center gap-1"
          >
            <span>All Products ({totalProducts})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs uppercase tracking-widest text-[#6B6A67]">
            Retrieving inventory records...
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <Package className="w-10 h-10 text-[#6B6A67]" />
            <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
              You have not listed any artisan creations yet.
            </p>
            <Link to="/seller/products/new" className="btn-brutalist mt-2">
              List First Creation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <div
                key={product.productId}
                className="border border-[#1E1E1E] bg-[#E4E2DD] p-4 flex flex-col justify-between"
              >
                <div className="aspect-[3/4] bg-[#D9D6D0] border border-[#1E1E1E] overflow-hidden mb-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-satoshi text-xs text-[#6B6A67]">
                      NO IMAGE
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading uppercase text-base font-bold text-[#1E1E1E] truncate">
                      {product.name}
                    </span>
                    <span className="font-satoshi text-xs font-bold text-[#444444]">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-satoshi uppercase tracking-widest text-[#6B6A67] mt-1">
                    <span>{product.category}</span>
                    <span>{product.quantity} in stock</span>
                  </div>
                </div>
                <div className="border-t border-[#1E1E1E] mt-3 pt-3 flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold border border-[#1E1E1E] ${
                      product.status === "AVAILABLE"
                        ? "bg-green-100 text-green-900"
                        : "bg-[#DB4A2B] text-white"
                    }`}
                  >
                    {product.status}
                  </span>
                  <Link
                    to={`/seller/products/${product.productId}/edit`}
                    className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B]"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

