import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#E4E2DD]">
      <div className="max-w-md w-full border-2 border-[#1E1E1E] bg-[#ECEAE5] p-8 sm:p-12 shadow-[8px_8px_0px_#1E1E1E] text-center flex flex-col items-center gap-6 animate-slide-up">
        <div className="p-4 border border-[#1E1E1E] bg-[#1E1E1E] text-[#F8A348]">
          <Compass className="w-10 h-10" />
        </div>

        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            HTTP 404 // NOT FOUND
          </span>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            LOST IN ARCHIVE
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-3 leading-relaxed">
            The page or resource you are attempting to view does not exist within the Taru platform directory.
          </p>
        </div>

        <Link to="/" className="btn-brutalist flex items-center gap-2 w-full justify-center">
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </Link>
      </div>
    </div>
  );
}

