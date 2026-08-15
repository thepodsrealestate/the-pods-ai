"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("info@thepodsrealestate.ae");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("pods_auth_token", "authenticated_minesh_pods");
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid email address or passcode. Please try again.");
      }
    } catch (err: any) {
      setError("Authentication service temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex items-center justify-center font-sans antialiased selection:bg-[#C5A059] selection:text-black px-4 relative overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0D0F17] border border-[#1E2230] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 space-y-8">
        
        {/* Branding */}
        <div className="text-center space-y-3 flex flex-col items-center justify-center">
          <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-[#C5A059] via-[#E6C786] to-[#C5A059] shadow-xl shadow-[#C5A059]/10 inline-block">
            <img
              src="/logo_white.jpeg"
              alt="The Pods Real Estate"
              className="h-16 w-auto max-w-[180px] object-contain rounded-xl bg-[#0D0F17] p-1.5"
            />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base tracking-widest uppercase">The Pods</h2>
            <p className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase">Command Center</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151824] border border-[#1E2230] rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#C5A059]/50 transition-colors"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-450 uppercase tracking-wider">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151824] border border-[#1E2230] rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#C5A059]/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-sm rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Console"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-slate-500">
            Authorized broker access only. Real Estate AI Concierge System.
          </p>
        </div>
      </div>
    </div>
  );
}
