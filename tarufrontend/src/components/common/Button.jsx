import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "btn-brutalist",
    outline: "btn-brutalist-outline",
    accent: "relative inline-flex items-center justify-center font-satoshi font-medium uppercase text-sm tracking-widest px-6 py-3.5 border border-[#1E1E1E] bg-[#DB4A2B] text-[#E4E2DD] overflow-hidden select-none hover:bg-[#1E1E1E] transition-colors",
    danger: "relative inline-flex items-center justify-center font-satoshi font-medium uppercase text-sm tracking-widest px-6 py-3.5 border border-[#1E1E1E] bg-[#FF89A9] text-[#1E1E1E] overflow-hidden select-none hover:bg-[#DB4A2B] hover:text-white transition-colors",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${disabled || loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
}

