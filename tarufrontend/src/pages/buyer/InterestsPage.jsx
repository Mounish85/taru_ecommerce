import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import ProductGrid from "../../components/products/ProductGrid";
import { getMyInterests } from "../../api/interestApi";
import { getProducts } from "../../api/productApi";

export default function InterestsPage() {
  const [interestProducts, setInterestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([getMyInterests(), getProducts()])
      .then(([interestsRes, productsRes]) => {
        if (!mounted) return;
        const interestList = interestsRes?.interests || [];
        const allProducts = productsRes?.products || [];

        const interestedIds = interestList.map((i) => i.productId);
        const matched = allProducts.filter((p) =>
          interestedIds.includes(p.productId)
        );

        setInterestProducts(matched);
      })
      .catch((err) => console.error("Error fetching interests:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B] mb-2">
            <Heart className="w-4 h-4 fill-current text-[#DB4A2B]" />
            <span>SAVED CURATIONS</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E]">
            YOUR SAVED INTERESTS
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Artisan creations you have flagged for admiration or purchase consideration.
          </p>
        </div>

        <Link
          to="/buyer/recommendations"
          className="btn-brutalist flex items-center gap-2"
        >
          <span>VIEW RECOMMENDATIONS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {interestProducts.length === 0 && !loading ? (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-16 text-center flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_#1E1E1E]">
          <Heart className="w-12 h-12 text-[#DB4A2B]" />
          <h3 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
            No Interests Recorded Yet
          </h3>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] max-w-md leading-relaxed">
            Click the "Interested" heart icon on any product card or details page to record your admiration and generate tailored category recommendations.
          </p>
          <Link to="/buyer/products" className="btn-brutalist flex items-center gap-2 mt-4">
            <span>EXPLORE MARKETPLACE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <ProductGrid
          products={interestProducts}
          loading={loading}
        />
      )}
    </div>
  );
}

