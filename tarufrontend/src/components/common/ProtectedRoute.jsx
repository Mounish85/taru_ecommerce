import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E2DD] flex flex-col items-center justify-center p-6">
        <div className="border border-[#1E1E1E] bg-[#ECEAE5] p-8 shadow-[6px_6px_0px_#1E1E1E] flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1E1E1E] border-t-[#DB4A2B] animate-spin" />
          <p className="font-satoshi uppercase text-xs tracking-widest text-[#1E1E1E]">
            Authenticating Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

