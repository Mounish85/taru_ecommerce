import React from "react";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "../common/LoadingSkeleton";

export default function ProductGrid({
  products = [],
  loading = false,
  emptyMessage = "No artisan creations found.",
  onInterestAdded,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full border-2 border-[#1E1E1E] bg-[#ECEAE5] p-16 text-center flex flex-col items-center justify-center gap-4">
        <h3 className="font-heading text-2xl uppercase tracking-tighter text-[#1E1E1E]">
          Catalog Empty
        </h3>
        <p className="font-satoshi text-sm uppercase tracking-widest text-[#6B6A67] max-w-md">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          onInterestAdded={onInterestAdded}
        />
      ))}
    </div>
  );
}

