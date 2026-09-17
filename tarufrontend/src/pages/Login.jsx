import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Email and password are required.");
      toast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      toast.success(`Welcome back, ${result.user?.name || "Artisan Friend"}!`);

      // Determine redirection by user role
      const role = result.user?.role;
      const redirectPath = location.state?.from?.pathname || (role === "SELLER" ? "/seller" : "/buyer");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.customMessage || "Invalid credentials. Please check your email and password.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#E4E2DD]">
      <div className="w-full max-w-md border-2 border-[#1E1E1E] bg-[#ECEAE5] p-8 sm:p-12 shadow-[8px_8px_0px_#1E1E1E] flex flex-col gap-8 animate-slide-up">
        {/* Header */}
        <div className="border-b border-[#1E1E1E] pb-4">
          <span className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#DB4A2B]">
            AUTHENTICATION PORTAL
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold uppercase tracking-tighter text-[#1E1E1E] mt-1">
            LOGIN
          </h1>
          <p className="font-satoshi text-xs uppercase tracking-widest text-[#6B6A67] mt-2">
            Secure HTTP-only cookie authentication session.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 border border-red-600 bg-red-100 text-red-800 font-satoshi text-xs uppercase tracking-wider font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR.EMAIL@TARU.ORG"
              autoComplete="email"
              required
              className="input-brutalist uppercase"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-satoshi text-xs font-bold uppercase tracking-widest text-[#1E1E1E] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="input-brutalist"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            <span>ENTER PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-[#1E1E1E] pt-4 flex items-center justify-between font-satoshi text-xs uppercase tracking-widest text-[#6B6A67]">
          <span>New to Taru?</span>
          <Link
            to="/register"
            className="font-bold text-[#DB4A2B] hover:underline"
          >
            Register Account →
          </Link>
        </div>
      </div>
    </div>
  );
}

