import React, { useState, useRef } from "react";
import { Upload, X, RefreshCw, Image as ImageIcon, AlertCircle } from "lucide-react";
import Button from "../common/Button";
import { useToast } from "../../context/ToastContext";

const CATEGORIES = [
  "Handcrafts",
  "Textiles",
  "Home Decor",
  "Jewelry",
  "Pottery",
  "Organic Products",
  "Bamboo Crafts",
  "Folk Art",
];

export default function ProductForm({
  initialData = null,
  onSubmit,
  isEdit = false,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price !== undefined ? initialData.price : "",
    quantity: initialData?.quantity !== undefined ? initialData.quantity : "1",
    category: initialData?.category || "Handcrafts",
    productType: initialData?.productType || "REGULAR",
    status: initialData?.status || "AVAILABLE",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If switching to UNIQUE, constrain quantity to 1
      if (name === "productType" && value === "UNIQUE") {
        if (Number(updated.quantity) > 1) {
          updated.quantity = "1";
          toast.info("Unique products are limited to quantity 1.");
        }
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file exceeds 10MB limit.");
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required.";
    if (formData.price === "" || Number(formData.price) < 0) {
      newErrors.price = "Valid price is required.";
    }

    const qty = Number(formData.quantity);
    if (!Number.isInteger(qty) || qty < 0) {
      newErrors.quantity = "Quantity must be a positive whole number.";
    }

    if (formData.productType === "UNIQUE" && qty > 1) {
      newErrors.quantity = "A UNIQUE product can have quantity 0 or 1.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please complete all required fields correctly.");
      return;
    }

    if (isEdit) {
      // JSON submission for update
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };
      if (previewUrl && !imageFile) {
        payload.imageUrl = previewUrl;
      }
      onSubmit(payload, imageFile);
    } else {
      // Multipart FormData submission for creation
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("category", formData.category);
      data.append("productType", formData.productType);

      if (imageFile) {
        data.append("image", imageFile);
      }

      onSubmit(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-[#1E1E1E] bg-[#ECEAE5] p-6 sm:p-10 flex flex-col gap-8 shadow-[8px_8px_0px_#1E1E1E]"
    >
      <div className="border-b border-[#1E1E1E] pb-4">
        <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-tighter text-[#1E1E1E]">
          {isEdit ? "Edit Artisan Creation" : "List New Artisan Creation"}
        </h2>
        <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-1">
          Provide complete metadata for your handcrafted work. Images are synchronized with Google Drive.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Image Upload & Preview (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
            Artisan Photograph {imageFile ? "(Ready to upload)" : ""}
          </label>

          <div className="relative aspect-[3/4] w-full border-2 border-dashed border-[#1E1E1E] bg-[#D9D6D0] flex flex-col items-center justify-center overflow-hidden">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E4E2DD] text-[#1E1E1E] text-xs font-satoshi uppercase tracking-widest font-bold hover:bg-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DB4A2B] text-[#E4E2DD] text-xs font-satoshi uppercase tracking-widest font-bold hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#E4E2DD] transition-colors"
              >
                <div className="p-4 border border-[#1E1E1E] bg-[#ECEAE5] mb-3">
                  <Upload className="w-8 h-8 text-[#DB4A2B]" />
                </div>
                <span className="font-heading uppercase text-base text-[#1E1E1E]">
                  Select Product Image
                </span>
                <span className="font-satoshi text-[11px] uppercase tracking-widest text-[#6B6A67] mt-1">
                  JPG, PNG or WebP up to 10MB
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Right: Metadata Inputs (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-5">
          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
              Creation Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="E.G. DOKRA TRIBAL BRASS HORSE"
              className={`input-brutalist ${errors.name ? "border-red-600 bg-red-50" : ""}`}
            />
            {errors.name && (
              <span className="text-xs text-red-600 font-satoshi font-semibold">
                {errors.name}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
              Artisan Narrative / Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the cultural heritage, materials used, SHG makers, and dimensions..."
              className="input-brutalist resize-y"
            />
          </div>

          {/* Product Type & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Product Type *
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="input-brutalist bg-white"
              >
                <option value="REGULAR">REGULAR (Batch/Multi-unit)</option>
                <option value="UNIQUE">UNIQUE (1-of-1 Handcrafted)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-brutalist bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Price (INR ₹) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="₹ 1500"
                className={`input-brutalist ${errors.price ? "border-red-600 bg-red-50" : ""}`}
              />
              {errors.price && (
                <span className="text-xs text-red-600 font-satoshi font-semibold">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Available Stock (Units) *
              </label>
              <input
                type="number"
                min="0"
                max={formData.productType === "UNIQUE" ? "1" : undefined}
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder={formData.productType === "UNIQUE" ? "1" : "10"}
                className={`input-brutalist ${errors.quantity ? "border-red-600 bg-red-50" : ""}`}
              />
              {formData.productType === "UNIQUE" && (
                <span className="text-[10px] text-[#DB4A2B] font-satoshi uppercase tracking-widest">
                  Unique items can only have quantity 0 or 1.
                </span>
              )}
              {errors.quantity && (
                <span className="text-xs text-red-600 font-satoshi font-semibold">
                  {errors.quantity}
                </span>
              )}
            </div>
          </div>

          {/* If Edit mode, allow status adjustment */}
          {isEdit && (
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                Listing Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-brutalist bg-white"
              >
                <option value="AVAILABLE">AVAILABLE (Active in Store)</option>
                <option value="SOLD">SOLD (Out of Stock / Sold Unique)</option>
                <option value="INACTIVE">INACTIVE (Hidden from Public)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Submission Buttons */}
      <div className="border-t border-[#1E1E1E] pt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
        <Button
          type="submit"
          loading={loading}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {isEdit ? "Update Creation" : "Publish to Marketplace"}
        </Button>
      </div>
    </form>
  );
}

