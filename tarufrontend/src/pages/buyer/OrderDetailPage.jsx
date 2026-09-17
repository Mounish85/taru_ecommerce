import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileDown, CheckCircle2, AlertCircle, Clock, Truck, ShieldCheck, ExternalLink } from "lucide-react";
import Button from "../../components/common/Button";
import DeliveryTimeline from "../../components/delivery/DeliveryTimeline";
import { getOrder, getInvoice } from "../../api/orderApi";
import { getPayment } from "../../api/paymentApi";
import { getDelivery } from "../../api/deliveryApi";
import { useToast } from "../../context/ToastContext";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.allSettled([
      getOrder(orderId),
      getPayment(orderId),
      getDelivery(orderId),
    ]).then(([orderRes, paymentRes, deliveryRes]) => {
      if (!mounted) return;

      if (orderRes.status === "fulfilled" && orderRes.value?.order) {
        setOrder(orderRes.value.order);
        setItems(orderRes.value.items || []);
      }

      if (paymentRes.status === "fulfilled" && paymentRes.value?.payment) {
        setPayment(paymentRes.value.payment);
      }

      if (deliveryRes.status === "fulfilled" && deliveryRes.value?.delivery) {
        setDelivery(deliveryRes.value.delivery);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    setInvoiceLoading(true);
    try {
      const res = await getInvoice(orderId);
      if (res?.invoice) {
        setInvoiceData(res.invoice);
        toast.success("Google Drive invoice synchronized!");
        if (res.invoice.webViewLink) {
          window.open(res.invoice.webViewLink, "_blank", "noopener,noreferrer");
        }
      }
    } catch (err) {
      toast.error(err.customMessage || "Failed to generate Google Drive invoice.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse flex flex-col gap-8">
        <div className="h-6 w-32 bg-[#D9D6D0]" />
        <div className="h-16 w-1/2 bg-[#D9D6D0]" />
        <div className="h-64 w-full bg-[#D9D6D0] border border-[#1E1E1E]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading text-4xl uppercase tracking-tight text-[#1E1E1E]">
          Order Not Found
        </h2>
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2 mb-6">
          The requested order ID could not be retrieved from the database.
        </p>
        <Link to="/buyer/orders" className="btn-brutalist">
          ← Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back Link */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/buyer/orders"
          className="inline-flex items-center gap-2 font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Invoice Action */}
        <Button
          onClick={handleDownloadInvoice}
          loading={invoiceLoading}
          variant="primary"
          size="md"
          className="flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          <span>DOWNLOAD DRIVE INVOICE</span>
        </Button>
      </div>

      {/* Main Order Details Header */}
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            CERTIFIED ORDER SPECIFICATION
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            {order.orderId}
          </h1>
          <div className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2 flex flex-wrap gap-4">
            <span>Date: {new Date(order.createdAt).toLocaleString("en-IN")}</span>
            <span>•</span>
            <span>Buyer: {order.buyerId}</span>
            <span>•</span>
            <span className="font-bold text-[#1E1E1E]">Status: {order.status}</span>
          </div>
        </div>

        {invoiceData?.webViewLink && (
          <a
            href={invoiceData.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-satoshi text-xs uppercase tracking-widest font-bold text-[#DB4A2B] hover:underline"
          >
            <span>Open Google Drive PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Items Breakdown & Delivery (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Order Items List */}
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] shadow-[6px_6px_0px_#1E1E1E]">
            <div className="p-6 border-b border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD] flex items-center justify-between">
              <h3 className="font-heading text-xl uppercase tracking-tighter">
                ORDER ITEMS ({items.length})
              </h3>
              <span className="font-satoshi text-xs uppercase tracking-widest text-[#F8A348]">
                DISPATCHED FROM SHG CLUSTER
              </span>
            </div>

            <div className="divide-y divide-[#1E1E1E]">
              {items.map((item, idx) => {
                const subtotal = Number(item.quantity) * Number(item.unitPrice);
                return (
                  <div
                    key={item.orderItemId || idx}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-heading text-lg font-bold text-[#1E1E1E]">
                        PRODUCT REF: {item.productId}
                      </span>
                      <div className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-1">
                        Quantity: {item.quantity} unit(s) • Unit Price: ₹{Number(item.unitPrice).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="font-heading text-lg font-bold text-[#1E1E1E]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t-2 border-[#1E1E1E] bg-[#D9D6D0] flex items-baseline justify-between">
              <span className="font-heading text-xl uppercase tracking-tight text-[#1E1E1E]">
                TOTAL TRANSACTION VALUE
              </span>
              <span className="font-heading text-3xl font-bold text-[#DB4A2B]">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Delivery Tracking Section */}
          <div>
            <div className="flex items-center gap-2 font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B] mb-3">
              <Truck className="w-4 h-4" />
              <span>LIVE LOGISTICS & DISPATCH</span>
            </div>
            <DeliveryTimeline delivery={delivery} />
          </div>
        </div>

        {/* Right Column: Settlement & Consignee Summary (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Payment Card */}
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
              <span className="font-heading text-lg uppercase tracking-tight text-[#1E1E1E]">
                PAYMENT STATUS
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-satoshi uppercase tracking-widest font-bold border border-[#1E1E1E] ${
                  payment?.status === "SUCCESS"
                    ? "bg-green-100 text-green-900"
                    : "bg-[#E4E2DD] text-[#1E1E1E]"
                }`}
              >
                {payment?.status || "PENDING"}
              </span>
            </div>

            <div className="flex flex-col gap-2 font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
              <div>
                <span>Transaction Ref:</span>
                <p className="font-bold text-[#1E1E1E] truncate mt-0.5">
                  {payment?.transactionId || "SIMULATED GATEWAY"}
                </p>
              </div>
              {payment?.paidAt && (
                <div>
                  <span>Paid At:</span>
                  <p className="text-[#1E1E1E] mt-0.5">
                    {new Date(payment.paidAt).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 shadow-[4px_4px_0px_#1E1E1E] flex flex-col gap-3">
            <span className="font-heading text-lg uppercase tracking-tight text-[#1E1E1E] border-b border-[#1E1E1E] pb-3">
              CONSIGNEE DESTINATION
            </span>
            <p className="font-satoshi text-sm text-[#1E1E1E] leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          {/* Taru Drive Notice */}
          <div className="border border-[#1E1E1E] bg-white/40 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#DB4A2B] shrink-0 mt-0.5" />
            <p className="font-satoshi text-[11px] text-[#6B6A67] leading-relaxed">
              Invoices are automatically generated as PDF documents and saved into Taru Foundation's secure Google Drive directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

