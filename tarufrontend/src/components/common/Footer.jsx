import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1E1E1E] text-[#E4E2DD] border-t-2 border-[#1E1E1E] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#E4E2DD]/20">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tighter uppercase leading-none">
                TARU FOUNDATION
              </h2>
              <p className="font-satoshi text-sm sm:text-base text-[#D9D6D0]/80 max-w-md mt-6 leading-relaxed">
                Empowering rural women artisans and Self Help Groups (SHGs) through digital commerce, fair-trade market access, and sustainable artisan livelihoods.
              </p>
            </div>
            <div className="mt-8 font-satoshi text-xs uppercase tracking-widest text-[#F8A348]">
              JPMorgan Chase & Co. Code for Good 2022 Partner
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-4 font-satoshi text-xs uppercase tracking-widest">
            <span className="text-[#DB4A2B] font-bold">PLATFORM</span>
            <Link to="/buyer/products" className="hover:text-[#FF89A9] transition-colors">
              Artisan Catalog
            </Link>
            <Link to="/register" className="hover:text-[#FF89A9] transition-colors">
              Join as SHG Artisan
            </Link>
            <Link to="/buyer/cart" className="hover:text-[#FF89A9] transition-colors">
              Shopping Bag
            </Link>
            <a href="#about" className="hover:text-[#FF89A9] transition-colors">
              Our Mission
            </a>
          </div>

          {/* Impact Stats */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <span className="font-satoshi text-xs uppercase tracking-widest text-[#DB4A2B] font-bold">
              ARTISAN IMPACT
            </span>
            <div className="border border-[#E4E2DD]/20 p-4 bg-white/5">
              <div className="font-heading text-3xl font-bold text-[#E4E2DD]">500+</div>
              <div className="font-satoshi text-xs uppercase tracking-widest text-[#D9D6D0]/70 mt-1">
                SHG Members Trained
              </div>
            </div>
            <div className="border border-[#E4E2DD]/20 p-4 bg-white/5">
              <div className="font-heading text-3xl font-bold text-[#F8A348]">100%</div>
              <div className="font-satoshi text-xs uppercase tracking-widest text-[#D9D6D0]/70 mt-1">
                Direct Artisan Proceeds
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-satoshi text-xs uppercase tracking-widest text-[#D9D6D0]/60">
          <div>
            © {new Date().getFullYear()} TARU FOUNDATION. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>CHHATTISGARH RURAL LIVELIHOOD INITIATIVE</span>
            <span>COOKIE-BASED RBAC PLATFORM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

