import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroSection from "../components/home/HeroSection";
import CategoryBanners from "../components/home/CategoryBanners";
import CampaignSection from "../components/home/CampaignSection";
import ProductGrid from "../components/products/ProductGrid";
import { getProducts } from "../api/productApi";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((res) => {
        if (isMounted && res?.products) {
          // Take first 6 products for the homepage showcase
          setFeaturedProducts(res.products.slice(0, 6));
        }
      })
      .catch((err) => console.error("Featured products fetch failed:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Full Viewport Hero Section */}
      <HeroSection />

      {/* 2. Featured Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-[#1E1E1E] pb-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-satoshi font-bold uppercase tracking-widest text-[#DB4A2B] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRESH FROM RURAL WORKSHOPS</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E]">
              FEATURED CREATIONS
            </h2>
          </div>

          <Link
            to="/buyer/products"
            className="group flex items-center gap-2 font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors pb-1 border-b border-[#1E1E1E]"
          >
            <span>VIEW COMPLETE REPOSITORY ({featuredProducts.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          loading={loading}
          emptyMessage="No artisan creations currently in stock. Check back shortly as SHGs update inventory."
        />
      </section>

      {/* 3. Poster Category Dividers */}
      <CategoryBanners />

      {/* 4. Editorial Campaign / Mission Section */}
      <CampaignSection />
    </div>
  );
}

