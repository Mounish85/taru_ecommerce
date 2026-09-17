import React from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] sm:min-h-[92vh] w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-[#1E1E1E]">
      {/* Soft Blurred Radial Blobs with Multiply Blend Mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-10 -left-10 w-[55vw] h-[55vw] rounded-full bg-[#DB4A2B] opacity-60 blur-[140px] mix-blend-multiply animate-blob-1"
        />
        <div
          className="absolute top-1/3 -right-20 w-[60vw] h-[60vw] rounded-full bg-[#F8A348] opacity-55 blur-[140px] mix-blend-multiply animate-blob-2"
        />
      </div>

      {/* Top Tagline */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-5 sm:pb-6">
        <div className="flex items-center gap-2.5 font-satoshi text-xs uppercase tracking-widest text-[#1E1E1E] font-medium">
          <span className="w-2.5 h-2.5 bg-[#DB4A2B] inline-block shrink-0" />
          <span>RURAL SHG ARTISAN REVOLUTION // CHHATTISGARH</span>
        </div>
        <div className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          DIRECT-FROM-SOURCE CRAFTSMANSHIP
        </div>
      </div>

      {/* Massive Brutalist Typography with Precise Fit & Asymmetrical Lockup */}
      <div className="relative z-10 py-8 sm:py-12 lg:py-16 select-none flex flex-col w-full overflow-hidden">
        {/* Line 1: TARU */}
        <div className="w-full flex justify-start">
          <h1 className="font-heading text-[17vw] sm:text-[16.5vw] lg:text-[17vw] leading-[0.78] font-bold tracking-[-0.05em] uppercase text-[#1E1E1E] whitespace-nowrap transition-transform duration-500 hover:text-[#DB4A2B]">
            TARU
          </h1>
        </div>

        {/* Line 2: FOUNDATION (Harmoniously Scaled & Asymmetrically Right-Aligned) */}
        <div className="w-full flex justify-end">
          <h1 className="font-heading text-[11.2vw] sm:text-[10.8vw] lg:text-[11.2vw] leading-[0.78] font-bold tracking-[-0.04em] uppercase text-[#1E1E1E] whitespace-nowrap -mt-2 sm:-mt-4 lg:-mt-7 text-right transition-transform duration-500 hover:text-[#DB4A2B]">
            FOUNDATION
          </h1>
        </div>
      </div>

      {/* Bottom Editorial Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end border-t border-[#1E1E1E] pt-6 sm:pt-8">
        <div className="md:col-span-6 flex flex-col gap-3">
          <p className="font-satoshi text-base sm:text-lg text-[#1E1E1E] max-w-xl leading-relaxed">
            Connecting conscientious buyers with certified rural Self Help Groups (SHGs). Authentic terracotta, dokra brass, handloom textiles, and rare 1-of-1 creations.
          </p>
        </div>

        <div className="md:col-span-6 flex flex-wrap items-center justify-start md:justify-end gap-3 sm:gap-4">
          <Link
            to="/buyer/products"
            className="btn-brutalist flex items-center gap-2"
          >
            <span>EXPLORE CATALOG</span>
            <ArrowDownRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="btn-brutalist-outline flex items-center gap-2"
          >
            <span>JOIN AS ARTISAN</span>
            <Sparkles className="w-4 h-4 text-[#DB4A2B]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
