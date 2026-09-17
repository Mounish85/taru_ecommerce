import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, Sparkles, ShoppingBag, ArrowRight, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../api/orderApi";
import { getMyInterests } from "../../api/interestApi";
import { getRecommendations } from "../../api/recommendationApi";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [interests, setInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      getOrders(),
      getMyInterests(),
      getRecommendations(),
    ]).then(([ordersRes, interestsRes, recsRes]) => {
      if (!mounted) return;
      if (ordersRes.status === "fulfilled" && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
      if (interestsRes.status === "fulfilled" && interestsRes.value?.interests) {
        setInterests(interestsRes.value.interests);
      }
      if (recsRes.status === "fulfilled" && recsRes.value?.recommendations) {
        setRecommendations(recsRes.value.recommendations);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            BUYER PORTAL // OVERVIEW
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            WELCOME, {user?.name?.toUpperCase()}
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Buyer ID: {user?.userId} • Session: Active
          </p>
        </div>

        <Link to="/buyer/products" className="btn-brutalist flex items-center gap-2">
          <span>BROWSE MARKETPLACE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <Link
          to="/buyer/orders"
          className="group border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_#1E1E1E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
              COMPLETED / ACTIVE ORDERS
            </span>
            <Package className="w-5 h-5 text-[#DB4A2B]" />
          </div>
          <div className="mt-8">
            <span className="font-heading text-5xl font-bold text-[#1E1E1E]">
              {loading ? "..." : orders.length}
            </span>
            <div className="flex items-center gap-1 font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] mt-2 group-hover:translate-x-1 transition-transform">
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        <Link
          to="/buyer/interests"
          className="group border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_#1E1E1E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
              RECORDED INTERESTS
            </span>
            <Heart className="w-5 h-5 text-[#DB4A2B]" />
          </div>
          <div className="mt-8">
            <span className="font-heading text-5xl font-bold text-[#1E1E1E]">
              {loading ? "..." : interests.length}
            </span>
            <div className="flex items-center gap-1 font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] mt-2 group-hover:translate-x-1 transition-transform">
              <span>Inspect Interests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        <Link
          to="/buyer/recommendations"
          className="group border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_#1E1E1E] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#6B6A67]">
              TAILORED RECOMMENDATIONS
            </span>
            <Sparkles className="w-5 h-5 text-[#DB4A2B]" />
          </div>
          <div className="mt-8">
            <span className="font-heading text-5xl font-bold text-[#1E1E1E]">
              {loading ? "..." : recommendations.length}
            </span>
            <div className="flex items-center gap-1 font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] mt-2 group-hover:translate-x-1 transition-transform">
              <span>View Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-8 shadow-[6px_6px_0px_#1E1E1E]">
        <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4 mb-6">
          <h2 className="font-heading text-2xl uppercase tracking-tighter text-[#1E1E1E]">
            RECENT DISPATCHES & ORDERS
          </h2>
          <Link
            to="/buyer/orders"
            className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] hover:underline"
          >
            All Orders →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs uppercase tracking-widest text-[#6B6A67]">
            Synchronizing orders with Google Sheets...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#6B6A67]" />
            <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
              You haven't placed any artisan orders yet.
            </p>
            <Link to="/buyer/products" className="btn-brutalist mt-2">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#1E1E1E]/20">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.orderId}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="font-heading text-lg font-bold text-[#1E1E1E]">
                    {order.orderId}
                  </span>
                  <div className="font-satoshi text-xs text-[#6B6A67] uppercase tracking-widest mt-0.5">
                    Date: {new Date(order.createdAt).toLocaleDateString("en-IN")} • Amount: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E] ${
                      order.status === "PAID" || order.status === "DELIVERED"
                        ? "bg-green-100 text-green-900"
                        : "bg-[#E4E2DD] text-[#1E1E1E]"
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    to={`/buyer/orders/${order.orderId}`}
                    className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] hover:underline"
                  >
                    Details & Invoice →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

