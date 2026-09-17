import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Search, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, Send } from "lucide-react";
import Button from "../../components/common/Button";
import DeliveryTimeline from "../../components/delivery/DeliveryTimeline";
import { createDelivery, getDelivery, updateDelivery } from "../../api/deliveryApi";
import { useToast } from "../../context/ToastContext";

const STATUS_FLOW = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function DeliveryManagementPage() {
  const [orderId, setOrderId] = useState("");
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // New Delivery Creation Form
  const [newOrderId, setNewOrderId] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const toast = useToast();

  const handleLookup = async (idToLook) => {
    const id = idToLook || orderId;
    if (!id.trim()) {
      toast.error("Please enter an Order ID to inspect delivery.");
      return;
    }

    setSearchLoading(true);
    try {
      const res = await getDelivery(id.trim());
      if (res?.delivery) {
        setActiveDelivery(res.delivery);
        toast.success(`Delivery record loaded for ${id.trim()}`);
      } else {
        setActiveDelivery(null);
        toast.info("No delivery record found for this order. You can initialize one below.");
      }
    } catch (err) {
      setActiveDelivery(null);
      toast.info(err.customMessage || "No delivery record exists yet for this order.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateDelivery = async (e) => {
    e.preventDefault();
    if (!newOrderId.trim() || !newAddress.trim()) {
      toast.error("Order ID and Consignee Address are required.");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createDelivery({
        orderId: newOrderId.trim(),
        address: newAddress.trim(),
      });
      toast.success("Delivery dispatch record created successfully!");
      setActiveDelivery(res.delivery);
      setOrderId(newOrderId.trim());
      setNewOrderId("");
      setNewAddress("");
    } catch (err) {
      toast.error(err.customMessage || "Failed to create delivery record.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusAdvance = async (nextStatus) => {
    if (!activeDelivery?.orderId) return;

    setUpdatingStatus(true);
    try {
      const res = await updateDelivery(activeDelivery.orderId, nextStatus);
      toast.success(`Status advanced to ${nextStatus}!`);
      setActiveDelivery(res.delivery);
    } catch (err) {
      toast.error(err.customMessage || "Failed to update delivery status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            DISPATCH & FULFILLMENT DESK
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            DELIVERY MANAGEMENT
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Initialize consignments, assign tracking codes, and advance delivery checkpoints.
          </p>
        </div>

        <Link to="/seller" className="btn-brutalist flex items-center gap-2">
          <span>DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Lookup & Active Record (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Order Search Card */}
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E]">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] mb-2 block">
              LOOK UP EXISTING ORDER DISPATCH
            </span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ENTER ORDER ID (E.G. ORD_...)"
                className="input-brutalist uppercase"
              />
              <Button
                onClick={() => handleLookup()}
                loading={searchLoading}
                variant="primary"
                size="md"
                className="shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>INSPECT</span>
              </Button>
            </div>
          </div>

          {/* Active Delivery Card & Status Advance */}
          {activeDelivery ? (
            <div className="flex flex-col gap-6 animate-slide-up">
              <DeliveryTimeline delivery={activeDelivery} />

              {/* Status Advance Controls */}
              <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
                  <span className="font-heading text-lg uppercase tracking-tight text-[#1E1E1E]">
                    ADVANCE DISPATCH CHECKPOINT
                  </span>
                  <span className="font-satoshi text-xs uppercase tracking-widest text-[#DB4A2B] font-bold">
                    CURRENT: {activeDelivery.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {STATUS_FLOW.map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus || activeDelivery.status === st}
                      onClick={() => handleStatusAdvance(st)}
                      className={`px-3.5 py-2 font-satoshi text-xs font-bold uppercase tracking-wider border border-[#1E1E1E] transition-colors ${
                        activeDelivery.status === st
                          ? "bg-[#1E1E1E] text-[#E4E2DD] pointer-events-none"
                          : "bg-[#E4E2DD] text-[#1E1E1E] hover:bg-[#DB4A2B] hover:text-white"
                      }`}
                    >
                      {st.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#1E1E1E] p-12 text-center bg-[#ECEAE5]">
              <Truck className="w-10 h-10 text-[#6B6A67] mx-auto mb-3" />
              <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
                Enter an Order ID above to view or update its live dispatch status.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Initialize New Delivery Record (5 cols) */}
        <div className="lg:col-span-5 border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-8 shadow-[6px_6px_0px_#1E1E1E] flex flex-col gap-6">
          <div className="border-b border-[#1E1E1E] pb-3">
            <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
              DISPATCH INITIALIZATION
            </span>
            <h3 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E] mt-1">
              INITIALIZE DISPATCH
            </h3>
            <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-1">
              Generate tracking identifier and start fulfillment tracking for an order.
            </p>
          </div>

          <form onSubmit={handleCreateDelivery} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Order Identifier *
              </label>
              <input
                type="text"
                required
                value={newOrderId}
                onChange={(e) => setNewOrderId(e.target.value)}
                placeholder="ORD_XXXX..."
                className="input-brutalist uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Consignee Shipping Address *
              </label>
              <textarea
                rows={3}
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="COPY SHIPPING ADDRESS FROM BUYER'S ORDER..."
                className="input-brutalist uppercase"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={createLoading}
              className="w-full mt-2"
            >
              <Send className="w-4 h-4" />
              <span>INITIALIZE DELIVERY & TRK CODE</span>
            </Button>
          </form>

          <div className="border border-[#1E1E1E] bg-white/40 p-4 flex items-start gap-3 mt-2">
            <ShieldCheck className="w-5 h-5 text-[#DB4A2B] shrink-0 mt-0.5" />
            <p className="font-satoshi text-[11px] text-[#6B6A67] leading-relaxed">
              Upon initialization, the backend automatically generates a unique tracking code (`TRK_...`) and synchronizes it with Google Sheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

