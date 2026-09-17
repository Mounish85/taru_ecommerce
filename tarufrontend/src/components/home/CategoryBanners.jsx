import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "HANDCRAFTS",
    subtitle: "DOKRA BRASS, TERRACOTTA & WOODEN HERITAGE",
    count: "CURATED SHG PIECES",
    path: "/buyer/products?category=Handcrafts",
    tag: "01",
  },
  {
    name: "TEXTILES",
    subtitle: "INDIGENOUS WEAVES, TUSSAR SILK & KHADI",
    count: "HANDLOOM ARTISANS",
    path: "/buyer/products?category=Textiles",
    tag: "02",
  },
  {
    name: "HOME DECOR",
    subtitle: "ORGANIC BAMBOO & TRIBAL POTTERY",
    count: "ECO-SUSTAINABLE",
    path: "/buyer/products?category=Home%20Decor",
    tag: "03",
  },
  {
    name: "UNIQUE 1-OF-1",
    subtitle: "NON-REPLICABLE INDIVIDUAL MASTERWORKS",
    count: "ARCHIVE COLLECTIBLES",
    path: "/buyer/products?type=UNIQUE",
    tag: "04",
  },
];

export default function CategoryBanners() {
  return (
    <section className="w-full border-b border-[#1E1E1E]">
      {CATEGORIES.map((cat, idx) => (
        <Link
          key={cat.name}
          to={cat.path}
          className="group relative block w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-8 border-b last:border-b-0 border-[#1E1E1E] overflow-hidden transition-colors duration-500 hover:bg-[#D9D6D0]"
          style={{
            backgroundImage:
              idx % 2 === 0
                ? "radial-gradient(ellipse at 80% 50%, rgba(248, 163, 72, 0.12), transparent 70%)"
                : "radial-gradient(ellipse at 20% 50%, rgba(219, 74, 43, 0.10), transparent 70%)",
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-baseline justify-between gap-6 relative z-10">
            <div className="flex items-baseline gap-3 sm:gap-6 flex-wrap">
              <span className="font-satoshi text-xs sm:text-sm font-bold uppercase tracking-widest text-[#DB4A2B] shrink-0">
                [{cat.tag}]
              </span>
              <h2 className="font-heading text-[9vw] sm:text-[9.5vw] lg:text-[10vw] leading-[0.8] font-bold tracking-[-0.05em] uppercase text-[#1E1E1E] group-hover:text-[#DB4A2B] transition-colors duration-300">
                {cat.name}
              </h2>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
              <div className="flex flex-col text-left md:text-right font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
                <span className="text-[#1E1E1E] font-medium">{cat.subtitle}</span>
                <span>{cat.count}</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#1E1E1E] flex items-center justify-center bg-[#E4E2DD] group-hover:bg-[#1E1E1E] group-hover:text-[#E4E2DD] group-hover:rotate-45 transition-all duration-300 shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
