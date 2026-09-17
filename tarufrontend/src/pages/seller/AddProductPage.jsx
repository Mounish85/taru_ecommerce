import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/products/ProductForm";
import { createProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const res = await createProduct(formData);
      toast.success(`"${res.product?.name || "Product"}" published successfully to marketplace!`);
      navigate("/seller/products");
    } catch (err) {
      toast.error(err.customMessage || "Failed to create product. Please verify fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 font-satoshi text-xs uppercase tracking-widest font-bold text-[#1E1E1E] hover:text-[#DB4A2B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </Link>
      </div>

      <ProductForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}

