import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, HeartHandshake, Eye, Award } from "lucide-react";

export default function CampaignSection() {
  const highlights = [
    {
      title: "100% Direct Remittance",
      desc: "Every rupee flows straight to the SHG artisan account.",
      icon: HeartHandshake,
      link: "/buyer/products",
    },
    {
      title: "Authentic Dokra & Handloom",
      desc: "GI-tagged and culturally validated craftsmanship.",
      icon: Award,
      link: "/buyer/products?category=Handcrafts",
    },
    {
      title: "Google Drive Automated Invoicing",
      desc: "Real-time PDF invoice generation archived on cloud.",
      icon: ShieldCheck,
      link: "/register",
    },
    {
      title: "1-of-1 Unique Archive System",
      desc: "Single edition masterworks preserved even after sale.",
      icon: Eye,
      link: "/buyer/products?type=UNIQUE",
    },
  ];

  return (
    <section id="about" className="w-full bg-[#D9D6D0] border-b border-[#1E1E1E] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: 8 Columns Editorial Headline */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
              CAMPAIGN 2026 // VOCATIONAL EMPOWERMENT
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.85] text-[#1E1E1E]">
              BUILDING SOVEREIGNTY FOR 500+ RURAL WOMEN ARTISANS.
            </h2>
            <p className="font-satoshi text-base sm:text-lg text-[#1E1E1E]/80 max-w-2xl leading-relaxed mt-4">
              Initiated through JPMorgan Chase & Co. Code for Good, Taru Foundation provides rural Self Help Groups with technical market linkages, inventory dignity, and open-market access to eliminate predatory middlemen.
            </p>

            <div className="flex items-center gap-4 pt-6">
              <Link to="/buyer/products" className="btn-brutalist">
                SUPPORT AN ARTISAN TODAY
              </Link>
            </div>
          </div>

          {/* Right: 4 Columns Stacked Links */}
          <div className="lg:col-span-4 flex flex-col divide-y divide-[#1E1E1E]/30 border-y border-[#1E1E1E]/30 lg:border-y-0 lg:border-l lg:border-[#1E1E1E]/30 lg:pl-8">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.link}
                  className="group py-6 first:pt-0 last:pb-0 flex items-start justify-between gap-4 transition-colors hover:text-[#DB4A2B]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#DB4A2B]" />
                      <span className="font-heading uppercase text-lg sm:text-xl font-bold tracking-tight text-[#1E1E1E] group-hover:text-[#DB4A2B] transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-satoshi text-xs text-[#6B6A67]">
                      {item.desc}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-[#1E1E1E] flex items-center justify-center shrink-0 group-hover:bg-[#1E1E1E] group-hover:text-[#E4E2DD] group-hover:rotate-45 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

