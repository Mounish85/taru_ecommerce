import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Clock, FileText } from "lucide-react";
import { getOrders } from "../../api/orderApi";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getOrders()
      .then((res) => {
        if (mounted && res?.orders) {
          setOrders(res.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B] mb-2">
            <Package className="w-4 h-4" />
            <span>DISPATCH ARCHIVE</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E]">
            ORDER HISTORY
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Track dispatches, review payment confirmations, and download Google Drive invoices.
          </p>
        </div>

        <Link to="/buyer/products" className="btn-brutalist flex items-center gap-2">
          <span>NEW ORDER</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : orders.length === 0 ? (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-16 text-center flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_#1E1E1E]">
          <Package className="w-12 h-12 text-[#DB4A2B]" />
          <h3 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
            No Orders on Record
          </h3>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] max-w-md">
            You have not placed any orders yet. Every purchase directly empowers certified rural SHG artisan groups.
          </p>
          <Link to="/buyer/products" className="btn-brutalist mt-4">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] shadow-[6px_6px_0px_#1E1E1E] overflow-x-auto">
          <table className="w-full text-left border-collapse font-satoshi text-xs uppercase tracking-wider">
            <thead>
              <tr className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD]">
                <th className="p-4 font-bold">ORDER IDENTIFIER</th>
                <th className="p-4 font-bold">DATE</th>
                <th className="p-4 font-bold">TOTAL AMOUNT</th>
                <th className="p-4 font-bold">STATUS</th>
                <th className="p-4 font-bold">SHIPPING DESTINATION</th>
                <th className="p-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]">
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-white/60 transition-colors"
                >
                  <td className="p-4 font-heading text-sm font-bold text-[#1E1E1E]">
                    {order.orderId}
                  </td>
                  <td className="p-4 text-[#6B6A67]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4 font-heading text-sm font-bold text-[#1E1E1E]">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-bold border border-[#1E1E1E] ${
                        order.status === "PAID" || order.status === "DELIVERED"
                          ? "bg-green-100 text-green-900"
                          : "bg-[#E4E2DD] text-[#1E1E1E]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B6A67] max-w-xs truncate" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/buyer/orders/${order.orderId}`}
                      className="inline-flex items-center gap-1 font-bold text-[#DB4A2B] hover:text-[#1E1E1E] transition-colors"
                    >
                      <span>DETAILS & INVOICE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

