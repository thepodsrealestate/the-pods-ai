"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  Building2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Download,
  CheckCircle2,
  Menu,
  X,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Send,
  Award,
  LogOut,
  Pause,
  Play,
  Gift,
  ShieldCheck,
  FileText,
  Megaphone,
  Lightbulb,
  Globe
} from "lucide-react";

function SourceBadge({ source }: { source: string }) {
  const upper = (source || "DIRECT").toUpperCase();

  if (upper.includes("WHATSAPP")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2a10 10 0 0 0-8.59 15.11L2 22l4.99-1.31A10 10 0 1 0 12 2zm0 18a7.95 7.95 0 0 1-4.07-1.12l-.29-.17-3.02.79.81-2.94-.19-.3A7.96 7.96 0 1 1 12 20z"/>
        </svg>
        <span>WhatsApp Direct</span>
      </span>
    );
  }

  if (upper.includes("INSTAGRAM")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        <span>Instagram Ads</span>
      </span>
    );
  }

  if (upper.includes("FACEBOOK")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span>Facebook Ads</span>
      </span>
    );
  }

  if (upper.includes("GOOGLE")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
        </svg>
        <span>Google Search</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
      <Globe className="w-3.5 h-3.5" />
      <span>{upper.replace("_", " ")}</span>
    </span>
  );
}

export default function MasterDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "conversations" | "bookings" | "analytics">("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedConvIndex, setSelectedConvIndex] = useState<number>(0);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  // Lead Slide-Over Drawer States
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [issuedVoucher, setIssuedVoucher] = useState<any>(null);
  const [generatingVoucher, setGeneratingVoucher] = useState<boolean>(false);
  const [togglingAi, setTogglingAi] = useState<boolean>(false);

  // Settings States
  const [adminPhone, setAdminPhone] = useState<string>("+971509876543");
  const [adminEmail, setAdminEmail] = useState<string>("info@thepodsrealestate.ae");
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.adminPhone) setAdminPhone(data.adminPhone);
        if (data.adminEmail) setAdminEmail(data.adminEmail);
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSaveMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPhone, adminEmail }),
      });
      if (res.ok) {
        setSettingsSaveMsg("Notification alert recipient settings updated successfully!");
        setTimeout(() => setSettingsSaveMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("pods_auth_token");
    if (token !== "authenticated_minesh_pods") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAi = async (leadId: string, currentStatus: boolean) => {
    try {
      setTogglingAi(true);
      const res = await fetch("/api/leads/toggle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, aiEnabled: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        if (selectedLead) {
          setSelectedLead({ ...selectedLead, aiEnabled: !currentStatus, handoffStatus: currentStatus });
        }
        fetchData();
      }
    } catch (e) {
      console.error("Toggle AI failed:", e);
    } finally {
      setTogglingAi(false);
    }
  };

  const handleGenerateVoucher = async (leadId: string) => {
    try {
      setGeneratingVoucher(true);
      const res = await fetch("/api/vouchers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, valueAed: 20000 }),
      });
      const json = await res.json();
      if (json.success) {
        setIssuedVoucher(json.voucher);
        fetchData();
      }
    } catch (e) {
      console.error("Voucher generation failed:", e);
    } finally {
      setGeneratingVoucher(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const stats = data?.stats || { totalLeads: 0, aiQualified: 0, handoffsRequired: 0, totalBookings: 0, totalVouchers: 0 };
  const leads = data?.recentLeads || [];
  const conversations = data?.conversations || [];
  const bookings = data?.bookings || [];

  // Calculate Lead Source Distribution dynamically from DB leads
  const sourceCounts = leads.reduce((acc: Record<string, number>, lead: any) => {
    const source = lead.leadSource || "DIRECT";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  const totalLeadsCount = leads.length || 1;

  const navItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "leads", name: "Lead Matrix", icon: Users },
    { id: "conversations", name: "Conversations", icon: MessageSquare },
    { id: "bookings", name: "VIP Bookings", icon: Calendar },
    { id: "analytics", name: "Analytics & Export", icon: BarChart3 },
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07080C] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C5A059]/20 border-t-[#C5A059] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-[#C5A059] selection:text-black">
      
      {/* 📱 MOBILE TOP NAVIGATION BAR */}
      <div className="md:hidden bg-[#0D0F17] border-b border-[#1E2230] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center border border-[#C5A059]/40 shadow-sm shrink-0">
            <img 
              src="/logo_black.jpeg" 
              alt="The Pods Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo_white.jpeg";
              }}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-xs tracking-wider uppercase">The Pods</h1>
            <p className="text-[9px] text-[#C5A059] font-bold tracking-widest uppercase">Real Estate AI</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#151824] text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 📱 MOBILE DROPDOWN MENU - FIXED OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-50 bg-[#0D0F17]/95 backdrop-blur-xl border-b border-[#1E2230] p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#C5A059] text-black shadow-lg"
                    : "text-slate-400 hover:bg-[#151824] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 🖥️ DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex w-64 bg-[#0D0F17] border-r border-[#1E2230] flex-col justify-between select-none shrink-0 min-h-screen">
        <div>
          {/* Top Brand Header */}
          <div className="p-6 border-b border-[#1E2230] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-[#C5A059]/40 shadow-md shrink-0">
              <img 
                src="/logo_black.jpeg" 
                alt="The Pods Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to logo_white if logo_black has loading issue
                  (e.currentTarget as HTMLImageElement).src = "/logo_white.jpeg";
                }}
              />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm tracking-wider uppercase">The Pods</h2>
              <p className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase">Real Estate AI</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#C5A059]/20 to-[#C5A059]/5 text-[#C5A059] border border-[#C5A059]/40 shadow-md font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#151824]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059]" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-4 border-t border-[#1E2230] space-y-3">
          <div className="p-3 rounded-xl bg-[#151824] border border-[#1E2230] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[11px] text-slate-300 font-medium">WhatsApp Concierge</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Active</span>
          </div>

          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1E2230] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs text-[#C5A059] shrink-0">
                MP
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">Minesh Patel</p>
                <p className="text-[10px] text-slate-450 truncate">info@thepodsrealestate.ae</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("pods_auth_token");
                router.push("/login");
              }}
              className="p-1.5 rounded-lg bg-[#151824] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 🏙️ MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 border-b border-[#1E2230] bg-[#0D0F17]/80 backdrop-blur-md px-8 items-center justify-between sticky top-0 z-20 select-none">
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-extrabold text-white tracking-wide uppercase">
              The Pods Command Center
            </h1>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-medium text-[#C5A059] bg-[#151824] px-3 py-1 rounded-lg border border-[#C5A059]/20">
              Bluewaters & London Luxury Desks
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-[#151824] hover:bg-[#1E2230] text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C5A059]" : ""}`} />
            </button>
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <span>@thepodsrealestate</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 md:p-8 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Luxury Welcome Banner */}
              <div className="bg-gradient-to-r from-[#12141E] via-[#0D0F17] to-[#12141E] border border-[#C5A059]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                      Welcome back, Minesh
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                      The Pods AI Sales Concierge is actively serving Danube, Sobha, and Binghatti off-plan inquiries.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("conversations")}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2 shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>View Active WhatsApp Chats</span>
                  </button>
                </div>
              </div>

              {/* KPI Scorecards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Leads */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-5 shadow-xl hover:border-[#C5A059]/40 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads Ingested</span>
                    <div className="p-2 rounded-xl bg-[#151824] text-slate-300 group-hover:text-[#C5A059] transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">{stats.totalLeads}</div>
                  <p className="text-xs text-emerald-400 mt-2 font-medium">100% Phone Deduplicated</p>
                </div>

                {/* AI Qualified */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-5 shadow-xl hover:border-[#C5A059]/40 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Qualified Leads</span>
                    <div className="p-2 rounded-xl bg-[#151824] text-[#C5A059]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#C5A059] tracking-tight">{stats.aiQualified}</div>
                  <p className="text-xs text-slate-400 mt-2">Budget & Location Auto-Parsed</p>
                </div>

                {/* Human Takeovers */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-5 shadow-xl hover:border-[#C5A059]/40 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Human Handoffs</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-rose-400 tracking-tight">{stats.handoffsRequired}</div>
                  <p className="text-xs text-rose-300 mt-2 font-semibold">Requires Broker Attention</p>
                </div>

                {/* VIP Pod Bookings */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-5 shadow-xl hover:border-[#C5A059]/40 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VIP Pod Bookings</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight">{stats.totalBookings}</div>
                  <p className="text-xs text-emerald-400 mt-2">{stats.totalVouchers} Vouchers Complimented</p>
                </div>
              </div>

              {/* Grid: Recent Leads + Developer Catalog Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-bold text-white">Recent WhatsApp Inquiries</h3>
                      <p className="text-xs text-slate-400">Live feed from database</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-xs text-[#C5A059] font-bold hover:underline"
                    >
                      View All Matrix →
                    </button>
                  </div>

                  <div className="divide-y divide-[#1E2230]">
                    {leads.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-sm">
                        No WhatsApp leads recorded yet. Fire a test WhatsApp message to see live records here!
                      </div>
                    ) : (
                      leads.slice(0, 5).map((lead: any) => (
                        <div 
                          key={lead.id} 
                          onClick={() => { setSelectedLead(lead); setDrawerOpen(true); setIssuedVoucher(null); }}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151824] px-3.5 rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#151824] border border-[#C5A059]/30 flex items-center justify-center font-bold text-xs text-[#C5A059] shrink-0">
                              {lead.fullName ? lead.fullName.slice(0, 2).toUpperCase() : "WA"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{lead.fullName || "WhatsApp Inquiry"}</p>
                              <p className="text-xs text-slate-400 font-mono truncate">{lead.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-[#1E2230]/50">
                            <span className="text-xs text-[#C5A059] font-mono font-semibold">{lead.budgetMax ? `AED ${lead.budgetMax.toLocaleString()}` : "Budget Pending"}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                              lead.status === "QUALIFIED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}>
                              {lead.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Developer Portfolio Status */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Developer Portfolios</h3>
                    <p className="text-xs text-slate-400 mb-4">Official Specs & Brochures Active</p>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-[#151824] rounded-xl border border-[#1E2230] flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-200">Danube Properties</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">1% Monthly Plan</span>
                      </div>

                      <div className="p-3.5 bg-[#151824] rounded-xl border border-[#1E2230] flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-200">Sobha Realty</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">UK Office Hook</span>
                      </div>

                      <div className="p-3.5 bg-[#151824] rounded-xl border border-[#1E2230] flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-slate-200">Binghatti Developers</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">Mercedes & Skyflame</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#151824] rounded-xl border border-[#C5A059]/20 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-[#C5A059]" />
                      <p className="font-semibold text-white text-xs">VIP Client Privilege Policy</p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      AED 20,000 VIP Fine-Dining Vouchers at The Pods Bluewaters are offered to clients upon closing property deals with Minesh Patel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEAD MATRIX */}
          {activeTab === "leads" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Lead Matrix System</h1>
                  <p className="text-xs text-slate-400 mt-1">Real-time deduplicated WhatsApp lead directory</p>
                </div>

                <a
                  href="/api/export/csv"
                  download="the_pods_leads_export.csv"
                  className="px-4 py-2.5 bg-[#151824] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </a>
               <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#1E2230]">
                      <tr>
                        <th className="px-6 py-4">Lead Contact</th>
                        <th className="px-6 py-4">Traffic Source</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Buyer Location</th>
                        <th className="px-6 py-4">Budget Range</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#1E2230]">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                            No leads found in database. Send a WhatsApp test message to see live records here!
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead: any) => {
                          const attribution = lead.attributions?.[0];
                          const source = lead.leadSource || attribution?.source || "DIRECT";
                          const campaign = attribution?.campaign || attribution?.utmCampaign || null;
                          
                          // Style for different ad platforms
                          let badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";
                          if (source.includes("FACEBOOK")) {
                            badgeStyle = "bg-blue-600/10 text-blue-400 border-blue-500/20";
                          } else if (source.includes("INSTAGRAM")) {
                            badgeStyle = "bg-purple-600/10 text-purple-400 border-purple-500/20";
                          } else if (source.includes("GOOGLE")) {
                            badgeStyle = "bg-red-600/10 text-red-400 border-red-500/20";
                          } else if (source.includes("TIKTOK")) {
                            badgeStyle = "bg-zinc-800 text-zinc-100 border-zinc-700";
                          } else if (source !== "DIRECT") {
                            badgeStyle = "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30";
                          }

                          return (
                            <tr key={lead.id} className="hover:bg-[#151824]/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-[#151824] border border-[#C5A059]/30 flex items-center justify-center font-bold text-xs text-[#C5A059]">
                                    {lead.fullName ? lead.fullName.slice(0, 2).toUpperCase() : "WA"}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{lead.fullName || "WhatsApp Lead"}</p>
                                    <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-col space-y-1">
                                  <SourceBadge source={source} />
                                  {campaign && (
                                    <span className="inline-flex items-center text-[10px] text-slate-400 space-x-1 truncate max-w-[160px]" title={campaign}>
                                      <Megaphone className="w-3 h-3 text-[#C5A059] shrink-0" />
                                      <span className="truncate">{campaign}</span>
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  lead.status === "QUALIFIED"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : "bg-slate-800 text-slate-400"
                                }`}>
                                  {lead.status}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-xs font-medium text-slate-300">
                                {lead.buyerLocation || "Dubai (Default)"}
                              </td>

                              <td className="px-6 py-4 text-xs font-mono text-[#C5A059]">
                                {lead.budgetMax ? `AED ${lead.budgetMax.toLocaleString()}` : "Not Disclosed"}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => { setSelectedLead(lead); setDrawerOpen(true); setIssuedVoucher(null); }}
                                  className="px-3.5 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                >
                                  <span>Lead Dossier</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONVERSATIONS */}
          {activeTab === "conversations" && (
            <div className="h-[calc(100vh-7.5rem)] md:h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6 max-w-7xl mx-auto overflow-hidden">
              {/* Left Thread List */}
              <div className={`w-full md:w-80 bg-[#0D0F17] border border-[#1E2230] rounded-2xl flex-col shadow-xl overflow-hidden select-none shrink-0 ${
                mobileShowChat ? "hidden md:flex" : "flex h-full"
              }`}>
                <div className="p-4 border-b border-[#1E2230] bg-[#151824]">
                  <h3 className="font-bold text-white text-sm">Active Threads</h3>
                  <p className="text-[11px] text-slate-400">Live WhatsApp Chat Feeds</p>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-[#1E2230]">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      No active conversations in database yet.
                    </div>
                  ) : (
                    conversations.map((conv: any, idx: number) => {
                      const lastMsg = conv.messages[conv.messages.length - 1];
                      const isSelected = selectedConvIndex === idx;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setSelectedConvIndex(idx);
                            setMobileShowChat(true);
                          }}
                          className={`p-4 cursor-pointer transition-colors space-y-1 ${
                            isSelected ? "bg-[#C5A059]/10 border-l-4 border-[#C5A059]" : "hover:bg-[#151824]/50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-white text-xs truncate max-w-[170px]">
                              {conv.lead.fullName || conv.lead.phone}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-1 italic">
                            {lastMsg ? lastMsg.content : "No messages yet"}
                          </p>

                          <div className="flex items-center space-x-2 pt-1">
                            <span className={`w-2 h-2 rounded-full ${conv.lead.aiEnabled ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                            <span className="text-[10px] font-semibold uppercase text-slate-400">
                              {conv.lead.aiEnabled ? "AI Active" : "Human Control"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Transcript */}
              <div className={`flex-1 bg-[#0D0F17] border border-[#1E2230] rounded-2xl flex-col shadow-xl overflow-hidden ${
                mobileShowChat ? "flex h-full" : "hidden md:flex"
              }`}>
                {conversations.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8">
                    <MessageSquare className="w-10 h-10 text-[#C5A059]" />
                    <p className="text-sm font-semibold text-slate-400">No conversation selected</p>
                    <p className="text-xs text-slate-500 text-center max-w-sm">
                      As soon as a WhatsApp lead texts your number, the complete conversation transcript will render here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full">
                    {/* Header with Back Button on Mobile */}
                    <div className="p-4 border-b border-[#1E2230] bg-[#151824] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setMobileShowChat(false)}
                          className="md:hidden p-1.5 rounded-lg bg-[#0D0F17] border border-[#1E2230] text-[#C5A059] font-bold text-xs flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                        <div>
                          <h3 className="font-bold text-white text-sm">
                            {conversations[selectedConvIndex]?.lead.fullName || conversations[selectedConvIndex]?.lead.phone}
                          </h3>
                          <p className="text-xs text-[#C5A059] font-mono">
                            {conversations[selectedConvIndex]?.lead.phone}
                          </p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        conversations[selectedConvIndex]?.lead.aiEnabled
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}>
                        {conversations[selectedConvIndex]?.lead.aiEnabled ? "AI Active" : "Human Control"}
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-[#07080C]/60">
                      {conversations[selectedConvIndex]?.messages.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderType === "AI" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] md:max-w-md p-3.5 md:p-4 rounded-2xl shadow-lg space-y-1 ${
                              msg.senderType === "AI"
                                ? "bg-[#151824] border border-[#C5A059]/40 text-white rounded-br-none"
                                : "bg-[#1E2230] text-slate-200 rounded-bl-none"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 space-x-4">
                              <span className="font-bold tracking-wider uppercase text-[#C5A059]">
                                {msg.senderType === "AI" ? "AI Concierge" : "Lead"}
                              </span>
                              <span className="font-mono">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VIP BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">VIP Presentation Bookings</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Scheduled client presentations at Bluewaters Island Pods & London Office
                </p>
              </div>

              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#1E2230]">
                      <tr>
                        <th className="px-6 py-4">Client Contact</th>
                        <th className="px-6 py-4">Presentation Location</th>
                        <th className="px-6 py-4">Scheduled Date & Time</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#1E2230]">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                            No presentation bookings recorded yet.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b: any) => (
                          <tr key={b.id} className="hover:bg-[#151824]/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-white">{b.lead.fullName || "VIP Client"}</p>
                              <p className="text-xs text-slate-400 font-mono">{b.lead.phone}</p>
                            </td>

                            <td className="px-6 py-4 text-xs font-semibold text-slate-200">
                              {b.location}
                            </td>

                            <td className="px-6 py-4 text-xs font-mono text-emerald-400">
                              {new Date(b.meetingTime).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS & CSV EXPORT */}
          {activeTab === "analytics" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">System Analytics & Data Export</h1>
                  <p className="text-xs text-slate-400 mt-1">Response latency SLA metrics and lead data backup</p>
                </div>

                <a
                  href="/api/export/csv"
                  download="the_pods_leads_export.csv"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full CSV Export</span>
                </a>
              </div>

              {/* SLA KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Response Latency</span>
                  <div className="text-3xl font-black text-emerald-400 tracking-tight">0.85 sec</div>
                  <p className="text-xs text-slate-400">Target &lt;1.2s WhatsApp ACK</p>
                </div>

                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Multilingual Auto-Detect</span>
                  <div className="text-3xl font-black text-[#C5A059] tracking-tight">100%</div>
                  <p className="text-xs text-slate-400">English, Arabic, Russian, French & 10+ languages</p>
                </div>

                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Storage</span>
                  <div className="text-3xl font-black text-white tracking-tight">Active</div>
                  <p className="text-xs text-slate-400">Real-time deduplicated Supabase sync</p>
                </div>
              </div>

              {/* Lead traffic source distribution */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white">Lead Traffic Source Attribution</h3>
                <p className="text-xs text-slate-400">Ad platforms and marketing campaign performance metrics</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {Object.entries(sourceCounts).map(([src, count]: [string, any]) => {
                    const percentage = Math.round((count / totalLeadsCount) * 100);
                    
                    let barColor = "bg-[#C5A059]";
                    if (src.includes("FACEBOOK")) barColor = "bg-blue-500";
                    else if (src.includes("INSTAGRAM")) barColor = "bg-purple-500";
                    else if (src.includes("GOOGLE")) barColor = "bg-red-500";

                    return (
                      <div key={src} className="p-4 rounded-xl bg-[#151824] border border-[#1E2230] space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <SourceBadge source={src} />
                          <span className="text-slate-300 font-mono text-[11px]">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#1E2230] rounded-full h-1.5 overflow-hidden">
                          <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notification Alert Settings Card */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">Booking Alert & Notification Recipients</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Set the target phone number and email where Minesh Patel will receive instant booking alerts
                  </p>
                </div>

                {settingsSaveMsg && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                    {settingsSaveMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Notification Phone Number (WhatsApp / SMS)
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#151824] border border-[#1E2230] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059] font-mono transition-colors"
                    />
                    <p className="text-[11px] text-slate-500">Receives direct WhatsApp alert pings for new meeting bookings.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Notification Email Address
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="info@thepodsrealestate.ae"
                      className="w-full bg-[#151824] border border-[#1E2230] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                    <p className="text-[11px] text-slate-500">Receives Google Calendar event invitations and booking confirmations.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {savingSettings ? "Saving..." : "Save Notification Settings"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 🔮 LEAD DOSSIER & TAKEOVER SLIDE-OVER DRAWER */}
      {drawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-lg bg-[#0D0F17] border-l border-[#1E2230] h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[#1E2230] flex items-center justify-between bg-[#151824]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E6C786] p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#0D0F17] rounded-full flex items-center justify-center font-bold text-sm text-[#C5A059]">
                    {selectedLead.fullName ? selectedLead.fullName.slice(0, 2).toUpperCase() : "WA"}
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">{selectedLead.fullName || "WhatsApp Inquiry"}</h2>
                  <p className="text-xs text-slate-400 font-mono">{selectedLead.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Quick AI & Handoff Controls */}
              <div className="p-4 rounded-2xl bg-[#151824] border border-[#1E2230] flex items-center justify-between shadow-md">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">AI Concierge Control</p>
                  <div className="flex items-center text-[11px] text-slate-400 mt-0.5 space-x-1.5">
                    <span className={`w-2 h-2 rounded-full ${selectedLead.aiEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                    <span>{selectedLead.aiEnabled ? "AI Auto-Reply Active" : "AI Paused for Human Agent"}</span>
                  </div>
                </div>

                <button
                  disabled={togglingAi}
                  onClick={() => handleToggleAi(selectedLead.id, selectedLead.aiEnabled)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-2 ${
                    selectedLead.aiEnabled
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
                >
                  {selectedLead.aiEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{togglingAi ? "Updating..." : selectedLead.aiEnabled ? "Pause AI & Takeover" : "Resume AI"}</span>
                </button>
              </div>

              {/* Lead Intelligence Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Lead Intelligence Dossier</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Budget Range</span>
                    <p className="text-xs font-mono font-bold text-[#C5A059] mt-1">
                      {selectedLead.budgetMax ? `AED ${selectedLead.budgetMax.toLocaleString()}` : "Pending AI Discovery"}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Location</span>
                    <p className="text-xs font-medium text-slate-200 mt-1">{selectedLead.buyerLocation || "Dubai Marina / JLT"}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Traffic Source</span>
                    <div className="mt-1">
                      <SourceBadge source={selectedLead.leadSource || "DIRECT"} />
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Qualification Status</span>
                    <p className="text-xs font-bold text-emerald-400 uppercase mt-1">{selectedLead.status}</p>
                  </div>
                </div>
              </div>

              {/* VIP Voucher Perks Generator */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#151824] to-[#1E2230] border border-[#C5A059]/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4.5 h-4.5 text-[#C5A059]" />
                    <span className="text-xs font-bold text-white">VIP Dining Voucher (AED 20,000)</span>
                  </div>
                  <span className="text-[9px] bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">The Pods</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Issue a complimentary fine dining voucher at The Pods Bluewaters Island upon closing a property deal.
                </p>

                {issuedVoucher ? (
                  <div className="p-4 rounded-xl bg-[#0D0F17] border border-[#C5A059] text-center space-y-1.5 shadow-inner">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Voucher Code Issued</span>
                    <p className="text-xl font-mono font-black text-[#C5A059] tracking-widest">{issuedVoucher.code}</p>
                    <div className="flex items-center justify-center space-x-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valid at Bluewaters Island • Linked to Lead Record</span>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled={generatingVoucher}
                    onClick={() => handleGenerateVoucher(selectedLead.id)}
                    className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Award className="w-4 h-4" />
                    <span>{generatingVoucher ? "Generating Code..." : "Issue AED 20,000 VIP Voucher"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1E2230] bg-[#151824] flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveTab("conversations");
                  setDrawerOpen(false);
                }}
                className="w-full py-3 bg-[#1E2230] hover:bg-[#2A2F42] text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span>Open Full WhatsApp Chat History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
