import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Tag, Sparkles, Layers } from "lucide-react";
import ProductGrid from "../../components/products/ProductGrid";
import { getProducts } from "../../api/productApi";

const CATEGORIES = [
  "ALL",
  "Handcrafts",
  "Textiles",
  "Home Decor",
  "Jewelry",
  "Pottery",
  "Organic Products",
  "Bamboo Crafts",
  "Folk Art",
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "ALL";
  const currentType = searchParams.get("type") || "ALL";
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((res) => {
        if (mounted && res?.products) {
          setProducts(res.products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryChange = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "ALL") {
      next.delete("category");
    } else {
      next.set("category", cat);
    }
    setSearchParams(next);
  };

  const handleTypeChange = (type) => {
    const next = new URLSearchParams(searchParams);
    if (type === "ALL") {
      next.delete("type");
    } else {
      next.set("type", type);
    }
    setSearchParams(next);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      currentCategory === "ALL" || p.category === currentCategory;

    const matchesType = currentType === "ALL" || p.productType === currentType;

    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B] mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>DIRECT RURAL ARTISAN INVENTORY</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E]">
            MARKETPLACE CATALOG
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER BY NAME..."
            className="input-brutalist uppercase text-xs w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-6 mb-12 border border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-3 font-satoshi text-xs uppercase tracking-widest">
          <span className="font-bold text-[#1E1E1E] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#DB4A2B]" />
            EDITION:
          </span>
          {["ALL", "REGULAR", "UNIQUE"].map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 border border-[#1E1E1E] font-medium transition-colors ${
                currentType === type
                  ? "bg-[#1E1E1E] text-[#E4E2DD]"
                  : "bg-[#E4E2DD] text-[#1E1E1E] hover:bg-white"
              }`}
            >
              {type === "UNIQUE" ? "1-OF-1 UNIQUE" : type}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 font-satoshi text-xs uppercase tracking-widest border-t border-[#1E1E1E]/20 pt-4">
          <span className="font-bold text-[#1E1E1E] mr-2">CATEGORIES:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 border border-[#1E1E1E] transition-colors ${
                currentCategory === cat
                  ? "bg-[#DB4A2B] text-white font-bold"
                  : "bg-[#E4E2DD] text-[#1E1E1E] hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        emptyMessage="No creations match the selected filters. Try broadening your criteria."
      />
    </div>
  );
}

