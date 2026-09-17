import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-[#1E1E1E] bg-[#ECEAE5] animate-pulse">
      <div className="aspect-[3/4] bg-[#D9D6D0] w-full border-b border-[#1E1E1E]" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-[#D9D6D0] w-3/4" />
        <div className="h-3 bg-[#D9D6D0] w-1/2" />
        <div className="h-4 bg-[#D9D6D0] w-1/4 mt-2" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full border border-[#1E1E1E] bg-[#ECEAE5] overflow-hidden">
      <div className="border-b border-[#1E1E1E] bg-[#1E1E1E] p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-[#6B6A67] flex-1" />
        ))}
      </div>
      <div className="divide-y divide-[#1E1E1E]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 animate-pulse">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-[#D9D6D0] flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse flex flex-col gap-8">
      <div className="h-16 bg-[#D9D6D0] w-1/2 border border-[#1E1E1E]" />
      <div className="h-6 bg-[#D9D6D0] w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return <ProductCardSkeleton />;
}

