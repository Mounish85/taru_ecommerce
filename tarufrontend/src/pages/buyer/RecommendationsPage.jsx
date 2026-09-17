import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import ProductGrid from "../../components/products/ProductGrid";
import { getRecommendations } from "../../api/recommendationApi";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = () => {
    setLoading(true);
    getRecommendations()
      .then((res) => {
        if (res?.recommendations) {
          setRecommendations(res.recommendations);
        }
      })
      .catch((err) => console.error("Recommendations fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>ALGORITHMIC ARTISAN DISCOVERY</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E]">
            RECOMMENDED FOR YOU
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Curated from rural SHG clusters matching your saved craft categories.
          </p>
        </div>

        <Link
          to="/buyer/interests"
          className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors flex items-center gap-1.5 pb-1 border-b border-[#1E1E1E]"
        >
          <Heart className="w-4 h-4 text-[#DB4A2B]" />
          <span>Inspect Your Interests</span>
        </Link>
      </div>

      {recommendations.length === 0 && !loading ? (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-16 text-center flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_#1E1E1E]">
          <Sparkles className="w-12 h-12 text-[#DB4A2B]" />
          <h3 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
            No Recommendations Available Yet
          </h3>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] max-w-md leading-relaxed">
            The Taru recommendation engine analyzes the craft categories of products you mark as "Interested". Browse our catalog and save your preferences to activate curated recommendations!
          </p>
          <Link to="/buyer/products" className="btn-brutalist flex items-center gap-2 mt-4">
            <span>EXPLORE CATALOG & MARK INTERESTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <ProductGrid
          products={recommendations}
          loading={loading}
          onInterestAdded={fetchRecs}
        />
      )}
    </div>
  );
}

