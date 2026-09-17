import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/products/ProductForm";
import { getProduct, updateProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";

export default function EditProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getProduct(productId)
      .then((res) => {
        if (mounted && res?.product) {
          setProduct(res.product);
        }
      })
      .catch((err) => {
        toast.error(err.customMessage || "Unable to fetch product details.");
      })
      .finally(() => {
        if (mounted) setInitialLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      const res = await updateProduct(productId, data);
      toast.success(`"${res.product?.name || "Product"}" updated successfully!`);
      navigate("/seller/products");
    } catch (err) {
      toast.error(err.customMessage || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          Loading product record from database...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
          Product Not Found
        </h2>
        <Link to="/seller/products" className="btn-brutalist mt-4 inline-block">
          Return to Inventory
        </Link>
      </div>
    );
  }

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

      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isEdit={true}
        loading={loading}
      />
    </div>
  );
}

