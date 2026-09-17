import React from "react";
import { Clock, CheckCircle2, Truck, Package, Home } from "lucide-react";

const STAGES = [
  { key: "PENDING", label: "ORDER RECEIVED", icon: Clock },
  { key: "PROCESSING", label: "PREPARING SHIPMENT", icon: Package },
  { key: "SHIPPED", label: "DISPATCHED", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "OUT FOR DELIVERY", icon: Truck },
  { key: "DELIVERED", label: "DELIVERED", icon: Home },
];

export default function DeliveryTimeline({ delivery }) {
  if (!delivery) {
    return (
      <div className="border border-[#1E1E1E] bg-[#ECEAE5] p-6 text-center">
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          Delivery record not yet initialized by seller.
        </p>
      </div>
    );
  }

  const currentIdx = STAGES.findIndex((s) => s.key === delivery.status);

  return (
    <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-8 flex flex-col gap-6 shadow-[6px_6px_0px_#1E1E1E]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
        <div>
          <span className="font-satoshi text-[10px] uppercase tracking-widest text-[#DB4A2B] font-bold">
            TRACKING IDENTIFIER
          </span>
          <h4 className="font-heading text-xl sm:text-2xl uppercase tracking-tighter text-[#1E1E1E] mt-0.5">
            {delivery.trackingId || "PENDING ASSIGNMENT"}
          </h4>
        </div>

        <div className="flex flex-col sm:items-end font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          <span className="text-[#1E1E1E] font-bold">
            STATUS: {delivery.status?.replace(/_/g, " ")}
          </span>
          {delivery.updatedAt && (
            <span>
              Updated: {new Date(delivery.updatedAt).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative py-4">
        <div className="hidden md:flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#1E1E1E]/30 z-0" />
          {/* Active Line */}
          <div
            className="absolute top-5 left-8 h-0.5 bg-[#DB4A2B] z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIdx) / (STAGES.length - 1)) * 90}%`,
            }}
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className="relative z-10 flex flex-col items-center gap-2 max-w-[120px] text-center"
              >
                <div
                  className={`w-10 h-10 border-2 border-[#1E1E1E] flex items-center justify-center transition-colors ${
                    isCompleted
                      ? "bg-[#DB4A2B] text-white"
                      : "bg-[#E4E2DD] text-[#1E1E1E]"
                  } ${isCurrent ? "ring-4 ring-[#1E1E1E]/20" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`font-satoshi text-[10px] uppercase tracking-wider font-bold ${
                    isCompleted ? "text-[#1E1E1E]" : "text-[#6B6A67]"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Vertical Mobile Timeline */}
        <div className="flex md:hidden flex-col gap-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 border border-[#1E1E1E] flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-[#DB4A2B] text-white"
                      : "bg-[#E4E2DD] text-[#6B6A67]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-satoshi text-xs uppercase tracking-wider font-bold ${
                      isCompleted ? "text-[#1E1E1E]" : "text-[#6B6A67]"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] text-[#DB4A2B] uppercase tracking-widest font-bold">
                      Current Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination Address */}
      {delivery.address && (
        <div className="border-t border-[#1E1E1E] pt-4 flex flex-col gap-1">
          <span className="font-satoshi text-[10px] uppercase tracking-widest text-[#6B6A67] font-bold">
            CONSIGNEE DISPATCH ADDRESS
          </span>
          <p className="font-satoshi text-sm text-[#1E1E1E]">
            {delivery.address}
          </p>
        </div>
      )}
    </div>
  );
}

