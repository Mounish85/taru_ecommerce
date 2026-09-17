import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/productApi";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getProducts()
        .then((res) => {
          if (res?.products) {
            setProducts(res.products);
          }
        })
        .catch((err) => console.error("Search fetch error:", err))
        .finally(() => setLoading(false));

      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setSelectedCategory("ALL");
      setSelectedType("ALL");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    "ALL",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filtered = products.filter((p) => {
    const matchesQuery =
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;

    const matchesType =
      selectedType === "ALL" || p.productType === selectedType;

    return matchesQuery && matchesCategory && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-slide-up">
      <div className="relative w-full max-w-3xl bg-[#E4E2DD] border-2 border-[#1E1E1E] shadow-[8px_8px_0px_#1E1E1E] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header with Search Input */}
        <div className="flex items-center gap-3 p-4 border-b-2 border-[#1E1E1E] bg-[#ECEAE5]">
          <Search className="w-6 h-6 text-[#1E1E1E] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH ARTISAN CREATIONS, TEXTILES, CRAFTS..."
            className="w-full bg-transparent text-lg font-satoshi font-medium placeholder-[#6B6A67] focus:outline-none uppercase tracking-wide"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1E1E1E] hover:text-[#E4E2DD] transition-colors border border-transparent hover:border-[#1E1E1E]"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter tags */}
        <div className="p-4 border-b border-[#1E1E1E] bg-[#E4E2DD] flex flex-wrap gap-2 text-xs font-satoshi uppercase tracking-widest">
          <div className="flex items-center gap-1.5 mr-2 text-[#6B6A67]">
            <Tag className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          {["ALL", "REGULAR", "UNIQUE"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 border border-[#1E1E1E] transition-colors ${
                selectedType === t
                  ? "bg-[#1E1E1E] text-[#E4E2DD]"
                  : "bg-[#ECEAE5] hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}

          <div className="flex items-center gap-1.5 ml-4 mr-2 text-[#6B6A67]">
            <span>Category:</span>
          </div>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 border border-[#1E1E1E] transition-colors ${
                selectedCategory === c
                  ? "bg-[#1E1E1E] text-[#E4E2DD]"
                  : "bg-[#ECEAE5] hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 divide-y divide-[#1E1E1E]/20 flex-1">
          {loading ? (
            <div className="py-12 text-center text-sm uppercase tracking-widest text-[#6B6A67]">
              Searching artisan database...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <p className="font-heading text-xl uppercase tracking-tighter">
                No creations found
              </p>
              <p className="text-xs uppercase tracking-widest text-[#6B6A67]">
                Try adjusting your search terms or category filters
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.productId}
                to={`/buyer/products/${item.productId}`}
                onClick={onClose}
                className="flex items-center justify-between py-3.5 px-2 hover:bg-[#ECEAE5] group transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#D9D6D0] border border-[#1E1E1E] shrink-0 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="font-satoshi text-[9px] uppercase tracking-widest text-[#6B6A67]">
                        TARU
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading uppercase text-base group-hover:text-[#FF89A9] transition-colors">
                        {item.name}
                      </span>
                      {item.productType === "UNIQUE" && (
                        <span className="px-1.5 py-0.5 text-[9px] font-satoshi uppercase tracking-widest bg-[#1E1E1E] text-[#E4E2DD]">
                          UNIQUE
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-satoshi text-[#6B6A67] uppercase tracking-widest mt-0.5">
                      {item.category || "General"} • ₹{Number(item.price).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-satoshi uppercase tracking-widest text-[#DB4A2B] group-hover:translate-x-1 transition-transform">
                  <span>View</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

