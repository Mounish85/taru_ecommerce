import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { createOrder } from "../../api/orderApi";
import { createPayment, paymentSuccess } from "../../api/paymentApi";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState("ADDRESS"); // ADDRESS -> PAYING -> SUCCESS
  const [createdOrder, setCreatedOrder] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
          Your bag is empty.
        </p>
        <Link to="/buyer/products" className="btn-brutalist mt-4 inline-block">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !city.trim() || !postalCode.trim()) {
      toast.error("Please complete the destination shipping address.");
      return;
    }

    const fullAddress = `${shippingAddress.trim()}, ${city.trim()} - ${postalCode.trim()}${
      phoneNumber ? ` (Phone: ${phoneNumber.trim()})` : ""
    }`;

    setLoading(true);
    try {
      // 1. Create Order in backend: POST /orders
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const orderRes = await createOrder({
        items: orderItems,
        shippingAddress: fullAddress,
      });

      if (!orderRes.order?.orderId) {
        throw new Error("Order creation failed: missing order identifier from server.");
      }

      const newOrder = orderRes.order;
      setCreatedOrder(newOrder);
      toast.success(`Order ${newOrder.orderId} generated.`);

      // 2. Initialize Payment record: POST /payments
      setPaymentStep("PAYING");
      await createPayment({
        orderId: newOrder.orderId,
        amount: Number(newOrder.totalAmount),
      });

      // 3. Complete payment transaction: POST /payments/success
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await paymentSuccess({
        orderId: newOrder.orderId,
        transactionId,
      });

      // Clear local cart
      clearCart();
      setPaymentStep("SUCCESS");
      toast.success("Payment verified and completed! Generating Drive invoice...");

      setTimeout(() => {
        navigate(`/buyer/orders/${newOrder.orderId}`);
      }, 1500);
    } catch (err) {
      toast.error(err.customMessage || "Failed to process order or payment. Please try again.");
      setPaymentStep("ADDRESS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex items-center justify-between">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            CHECKOUT PIPELINE // STAGE 02
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            SHIPPING & SETTLEMENT
          </h1>
        </div>
        <Link
          to="/buyer/cart"
          className="font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Shipping Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <form
            onSubmit={handlePlaceOrder}
            className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-10 shadow-[6px_6px_0px_#1E1E1E] flex flex-col gap-6"
          >
            <div className="border-b border-[#1E1E1E] pb-3">
              <h2 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
                CONSIGNEE DELIVERY ADDRESS
              </h2>
              <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
                Used for dispatch logistics and printed on your Google Drive invoice.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Street Address / House No / Landmark *
              </label>
              <textarea
                rows={3}
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="FLAT 402, PALM GROVE APTS, CIVIL LINES..."
                className="input-brutalist uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                  City / District *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="RAIPUR"
                  className="input-brutalist uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="492001"
                  className="input-brutalist uppercase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Contact Mobile Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="input-brutalist uppercase"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-[#1E1E1E] pt-6 flex flex-col gap-3">
              <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                SELECT SETTLEMENT METHOD
              </span>
              <div className="grid grid-cols-2 gap-3">
                {["UPI / QR INSTANT", "DEBIT / CREDIT CARD"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 text-xs font-satoshi font-bold uppercase tracking-widest border border-[#1E1E1E] transition-colors ${
                      paymentMethod === method
                        ? "bg-[#1E1E1E] text-[#E4E2DD]"
                        : "bg-[#E4E2DD] text-[#1E1E1E] hover:bg-white"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-4"
            >
              {paymentStep === "PAYING"
                ? "AUTHENTICATING SETTLEMENT..."
                : paymentStep === "SUCCESS"
                ? "PAYMENT CONFIRMED ✓"
                : `AUTHORIZE & PAY ₹${totalAmount.toLocaleString("en-IN")}`}
            </Button>
          </form>
        </div>

        {/* Right: Order Review (5 cols) */}
        <div className="lg:col-span-5 border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-8 shadow-[6px_6px_0px_#1E1E1E] flex flex-col gap-6">
          <h3 className="font-heading text-2xl uppercase tracking-tighter text-[#1E1E1E] border-b border-[#1E1E1E] pb-3">
            ITEMS FOR DISPATCH ({items.length})
          </h3>

          <div className="divide-y divide-[#1E1E1E]/20 max-h-72 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold uppercase text-[#1E1E1E]">
                    {item.name}
                  </span>
                  <span className="font-satoshi text-[11px] text-[#6B6A67] uppercase tracking-widest">
                    Qty: {item.quantity} • ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="font-heading text-sm font-bold text-[#1E1E1E]">
                  ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[#1E1E1E] pt-4 flex items-baseline justify-between">
            <span className="font-heading text-lg uppercase tracking-tight text-[#1E1E1E]">
              TOTAL PAYABLE
            </span>
            <span className="font-heading text-3xl font-bold text-[#DB4A2B]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border border-[#1E1E1E] bg-white/50 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#DB4A2B] shrink-0 mt-0.5" />
            <p className="font-satoshi text-[11px] text-[#6B6A67] uppercase tracking-wider leading-relaxed">
              Order is written directly to Taru Google Sheets. An automated invoice PDF is pushed to Google Drive upon completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

