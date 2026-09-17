import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Package, Sparkles } from "lucide-react";
import { getSellerProducts, deleteProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import Button from "../../components/common/Button";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const toast = useToast();

  const fetchProducts = () => {
    setLoading(true);
    getSellerProducts()
      .then((res) => {
        if (res?.products) {
          setProducts(res.products);
        }
      })
      .catch((err) => {
        toast.error(err.customMessage || "Failed to load your products.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeactivate = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"? It will be marked as INACTIVE.`)) {
      return;
    }

    setDeactivatingId(productId);
    try {
      await deleteProduct(productId);
      toast.success(`"${name}" has been deactivated.`);
      fetchProducts();
    } catch (err) {
      toast.error(err.customMessage || "Failed to deactivate product.");
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b-2 border-[#1E1E1E] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            ARTISAN CATALOG MANAGEMENT
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] mt-1">
            MY PRODUCTS ({products.length})
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Manage your rural inventory, update prices, and upload single-edition or batch pieces.
          </p>
        </div>

        <Link to="/seller/products/new" className="btn-brutalist flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>LIST NEW CREATION</span>
        </Link>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : products.length === 0 ? (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-16 text-center flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_#1E1E1E]">
          <Package className="w-12 h-12 text-[#DB4A2B]" />
          <h3 className="font-heading text-2xl uppercase tracking-tight text-[#1E1E1E]">
            No Products Listed Yet
          </h3>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] max-w-md">
            Begin by adding your first handcrafted product with photos and artisan descriptions.
          </p>
          <Link to="/seller/products/new" className="btn-brutalist mt-4">
            Create Product
          </Link>
        </div>
      ) : (
        <div className="border-2 border-[#1E1E1E] bg-[#ECEAE5] shadow-[6px_6px_0px_#1E1E1E] overflow-x-auto">
          <table className="w-full text-left border-collapse font-satoshi text-xs uppercase tracking-wider">
            <thead>
              <tr className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] text-[#E4E2DD]">
                <th className="p-4 font-bold">ITEM</th>
                <th className="p-4 font-bold">CATEGORY</th>
                <th className="p-4 font-bold">TYPE</th>
                <th className="p-4 font-bold">PRICE</th>
                <th className="p-4 font-bold">STOCK</th>
                <th className="p-4 font-bold">STATUS</th>
                <th className="p-4 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E1E]">
              {products.map((p) => {
                const isUnique = p.productType === "UNIQUE";
                return (
                  <tr key={p.productId} className="hover:bg-white/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-[#D9D6D0] border border-[#1E1E1E] shrink-0 overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[8px] text-[#6B6A67]">TARU</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-heading text-sm font-bold text-[#1E1E1E] line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#6B6A67] tracking-widest font-mono">
                            {p.productId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[#6B6A67]">
                      {p.category || "General"}
                    </td>

                    <td className="p-4">
                      {isUnique ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-[#1E1E1E] text-[#E4E2DD] border border-[#1E1E1E]">
                          <Sparkles className="w-3 h-3 text-[#DB4A2B]" />
                          <span>1-OF-1 UNIQUE</span>
                        </span>
                      ) : (
                        <span className="text-[#1E1E1E] font-medium">REGULAR</span>
                      )}
                    </td>

                    <td className="p-4 font-heading text-sm font-bold text-[#1E1E1E]">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 font-bold text-[#1E1E1E]">
                      {p.quantity} units
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-bold border border-[#1E1E1E] ${
                          p.status === "AVAILABLE"
                            ? "bg-green-100 text-green-900"
                            : p.status === "SOLD"
                            ? "bg-[#DB4A2B] text-white"
                            : "bg-[#6B6A67] text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/buyer/products/${p.productId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-[#1E1E1E] bg-[#E4E2DD] hover:bg-white text-[#1E1E1E] transition-colors"
                          title="Preview in Store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/seller/products/${p.productId}/edit`}
                          className="p-1.5 border border-[#1E1E1E] bg-[#E4E2DD] hover:bg-white text-[#1E1E1E] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        {p.status !== "INACTIVE" && (
                          <button
                            onClick={() => handleDeactivate(p.productId, p.name)}
                            disabled={deactivatingId === p.productId}
                            className="p-1.5 border border-[#1E1E1E] bg-[#DB4A2B] hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                            title="Deactivate Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

