import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, User, Mail, Lock, Building, Phone, FileText } from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
    organizationName: "",
    contactInfo: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg("Name, email, and password are required.");
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (formData.role === "SELLER" && !formData.organizationName.trim()) {
      setErrorMsg("Organization / SHG group name is required for sellers.");
      toast.error("Please provide your SHG group name.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "SELLER") {
        payload.organizationName = formData.organizationName.trim();
        payload.contactInfo = formData.contactInfo.trim();
        payload.description = formData.description.trim();
      }

      await register(payload);
      toast.success("Account created successfully! Logging you in...");

      // Automatically login user
      const loginResult = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (loginResult.user?.role === "SELLER") {
        navigate("/seller", { replace: true });
      } else {
        navigate("/buyer", { replace: true });
      }
    } catch (err) {
      const msg = err.customMessage || "Registration failed. Please check your details.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-[#E4E2DD]">
      <div className="w-full max-w-xl border-2 border-[#1E1E1E] bg-[#ECEAE5] p-8 sm:p-12 shadow-[8px_8px_0px_#1E1E1E] flex flex-col gap-8 animate-slide-up">
        {/* Header */}
        <div className="border-b border-[#1E1E1E] pb-4">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            ONBOARDING REGISTRY
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold uppercase tracking-tighter text-[#1E1E1E] mt-1">
            CREATE ACCOUNT
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Select your role to connect with rural artisans or list handcrafted work.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 border border-red-600 bg-red-100 text-red-800 font-satoshi text-xs uppercase tracking-wider font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 border border-[#1E1E1E] p-1 bg-[#E4E2DD]">
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, role: "BUYER" }))}
            className={`py-3 font-satoshi text-xs font-bold uppercase tracking-widest transition-colors ${
              formData.role === "BUYER"
                ? "bg-[#1E1E1E] text-[#E4E2DD]"
                : "bg-transparent text-[#1E1E1E] hover:bg-black/5"
            }`}
          >
            I AM A BUYER
          </button>
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, role: "SELLER" }))}
            className={`py-3 font-satoshi text-xs font-bold uppercase tracking-widest transition-colors ${
              formData.role === "SELLER"
                ? "bg-[#1E1E1E] text-[#E4E2DD]"
                : "bg-transparent text-[#1E1E1E] hover:bg-black/5"
            }`}
          >
            I AM AN SHG ARTISAN / SELLER
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="DEVAKI BAI"
                required
                className="input-brutalist uppercase"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="DEVAKI@TARU.ORG"
                required
                className="input-brutalist uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Password *</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••••••"
              required
              className="input-brutalist"
            />
          </div>

          {/* Additional Seller Fields */}
          {formData.role === "SELLER" && (
            <div className="border-t border-[#1E1E1E] pt-6 flex flex-col gap-4 animate-slide-up">
              <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
                SHG CLUSTER PROFILE INFORMATION
              </span>

              <div className="flex flex-col gap-1.5">
                <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>SHG / Organization Name *</span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="BASTAR DOKRA ARTISAN SHG"
                  className="input-brutalist uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Information</span>
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210 / BASTAR, CHHATTISGARH"
                  className="input-brutalist uppercase"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Artisan Cluster Bio / Description</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell buyers about your group's traditional craft lineage, district, and materials used..."
                  className="input-brutalist resize-y"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            <span>REGISTER & ENTER PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-[#1E1E1E] pt-4 flex items-center justify-between font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          <span>Already registered?</span>
          <Link to="/login" className="font-bold text-[#DB4A2B] hover:underline">
            Login to Session →
          </Link>
        </div>
      </div>
    </div>
  );
}

