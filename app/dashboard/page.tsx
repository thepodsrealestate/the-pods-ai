"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LuxuryLoader from "../components/LuxuryLoader";
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
  Volume2,
  ShieldCheck,
  FileText,
  Megaphone,
  Lightbulb,
  Globe,
  Sliders,
  Mic,
  Trash2,
  Share2,
  Search,
  MessageCircle,
  ExternalLink,
  Filter
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

function formatTimeAgo(dateString?: string | Date | null) {
  if (!dateString) return "Just now";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function cleanWhatsAppPhone(phone?: string | null) {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

export default function MasterDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "conversations" | "bookings" | "analytics" | "settings">("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedConvIndex, setSelectedConvIndex] = useState<number>(0);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  const chatScrollEndRef = useRef<HTMLDivElement>(null);

  // Lead Slide-Over Drawer States
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [issuedVoucher, setIssuedVoucher] = useState<any>(null);
  const [generatingVoucher, setGeneratingVoucher] = useState<boolean>(false);
  const [togglingAi, setTogglingAi] = useState<boolean>(false);

  // Settings States
  const [adminPhone, setAdminPhone] = useState<string>("+971509876543");
  const [adminEmail, setAdminEmail] = useState<string>("info@thepodsrealestate.ae");
  const [resendApiKey, setResendApiKey] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  // Lead Filter & Search State
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("ALL");
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>("");
  const [leadAiFilter, setLeadAiFilter] = useState<string>("ALL");

  // Conversation Search & Filter State
  const [convSearchQuery, setConvSearchQuery] = useState<string>("");
  const [convFilter, setConvFilter] = useState<string>("ALL");

  // VIP Bookings View Mode State
  const [bookingViewMode, setBookingViewMode] = useState<"list" | "calendar">("list");

  // Test Email State
  const [sendingTestEmail, setSendingTestEmail] = useState<boolean>(false);
  const [testEmailMsg, setTestEmailMsg] = useState<string | null>(null);

  // Test WhatsApp State
  const [sendingTestWa, setSendingTestWa] = useState<boolean>(false);
  const [testWaMsg, setTestWaMsg] = useState<string | null>(null);

  // Test Booking State
  const [testingBooking, setTestingBooking] = useState<boolean>(false);
  const [testBookingMsg, setTestBookingMsg] = useState<string | null>(null);

  // AI Co-Pilot & Executive Briefing State
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [leadBriefings, setLeadBriefings] = useState<Record<string, any>>({});
  const [loadingBriefing, setLoadingBriefing] = useState<Record<string, boolean>>({});
  const [chatReplyInput, setChatReplyInput] = useState<string>("");
  // Delete Lead & Chat History State
  const [deleteModalLead, setDeleteModalLead] = useState<any | null>(null);
  const [deletePasscode, setDeletePasscode] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);

  const handleDeleteLead = async () => {
    if (!deleteModalLead) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/leads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: deleteModalLead.id,
          passcode: deletePasscode,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDeleteError(data.message || "Invalid passcode or deletion failed");
        setIsDeleting(false);
        return;
      }
      setDeleteSuccessMsg(data.message);
      await fetchData();
      setTimeout(() => {
        setDeleteModalLead(null);
        setDeletePasscode("");
        setDeleteSuccessMsg(null);
        if (selectedLead?.id === deleteModalLead.id) {
          setDrawerOpen(false);
          setSelectedLead(null);
        }
      }, 1200);
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateAiSuggestions = async (convId: string) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/ai/suggest-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error("AI Suggestions Error:", e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleGenerateLeadBriefing = async (leadId: string) => {
    setLoadingBriefing((prev) => ({ ...prev, [leadId]: true }));
    try {
      const res = await fetch("/api/ai/summarize-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success && data.briefing) {
        setLeadBriefings((prev) => ({ ...prev, [leadId]: data.briefing }));
      }
    } catch (e) {
      console.error("AI Briefing Error:", e);
    } finally {
      setLoadingBriefing((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  // Additional AI Features State
  const [voiceData, setVoiceData] = useState<Record<string, any>>({});
  const [loadingVoice, setLoadingVoice] = useState<Record<string, boolean>>({});
  const [matchedProjects, setMatchedProjects] = useState<Record<string, any[]>>({});
  const [loadingProjects, setLoadingProjects] = useState<Record<string, boolean>>({});
  const [generatingNudge, setGeneratingNudge] = useState<boolean>(false);

  // Floating AI Executive Advisor & Ad Metrics State
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);
  const [advisorQuery, setAdvisorQuery] = useState<string>("");
  const [loadingAdvisor, setLoadingAdvisor] = useState<boolean>(false);
  const [adPeriod, setAdPeriod] = useState<string>("last_30d");
  const [loadingAdMetrics, setLoadingAdMetrics] = useState<boolean>(false);
  const [advisorMessages, setAdvisorMessages] = useState<Array<{ role: "user" | "ai"; text: string; bullets?: string[] }>>([
    {
      role: "ai",
      text: "Welcome to The Pods Executive AI Advisor console. Ask me any question about your live Meta Ads ROI, Google Ads performance, lead response SLAs, or sales pipeline statistics.",
      bullets: [
        "Live Meta Ads API connected with real-time spend and reach sync",
        "Configurable date range filters (Today, Last 7D, Last 30D, This Month, All Time)",
        "Sub-10s WhatsApp greeting SLA active across all inbound leads"
      ]
    }
  ]);
  const [adMetrics, setAdMetrics] = useState<any>({
    summary: { totalSpendAed: 0, totalLeads: 0, overallCplAed: 0 },
    meta: { spendAed: 0, impressions: 0, clicks: 0, ctr: 0, leads: 0, cplAed: 0, isLive: false },
    google: { spendAed: 0, impressions: 0, clicks: 0, ctr: 0, leads: 0, cplAed: 0, isLive: false }
  });

  useEffect(() => {
    fetchAdMetrics("last_30d");
  }, []);

  const fetchAdMetrics = async (periodToFetch?: string) => {
    const p = periodToFetch || adPeriod;
    setLoadingAdMetrics(true);
    try {
      const res = await fetch(`/api/integrations/ad-metrics?period=${p}`);
      const json = await res.json();
      if (json.success && json.data) {
        setAdMetrics(json.data);
      }
    } catch (e) {
      console.error("Ad Metrics fetch error:", e);
    } finally {
      setLoadingAdMetrics(false);
    }
  };

  const handleSelectAdPeriod = (p: string) => {
    setAdPeriod(p);
    fetchAdMetrics(p);
  };

  // Load advisor history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("the_pods_advisor_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdvisorMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load advisor history:", e);
    }
  }, []);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAdvisorOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setAdvisorOpen(false);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [copiedAdvisor, setCopiedAdvisor] = useState<boolean>(false);

  const updateAdvisorMessages = (msgs: Array<{ role: "user" | "ai"; text: string; bullets?: string[] }>) => {
    setAdvisorMessages(msgs);
    try {
      localStorage.setItem("the_pods_advisor_history", JSON.stringify(msgs));
    } catch (e) {
      console.error("Failed to save advisor history:", e);
    }
  };

  const handleClearAdvisorHistory = () => {
    const initial = [
      {
        role: "ai" as const,
        text: "Welcome to The Pods Executive AI Advisor console. Ask me any question about your live Meta Ads ROI, Google Ads performance, lead response SLAs, or sales pipeline statistics.",
        bullets: [
          "Live Meta Ads API connected with real-time spend and reach sync",
          "Configurable date range filters (Today, Last 7D, Last 30D, This Month, All Time)",
          "Sub-10s WhatsApp greeting SLA active across all inbound leads"
        ]
      }
    ];
    setAdvisorMessages(initial);
    try {
      localStorage.removeItem("the_pods_advisor_history");
    } catch (e) {}
  };

  const handleToggleVoiceDictation = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListeningVoice(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAdvisorQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsListeningVoice(false);
      recognition.onend = () => setIsListeningVoice(false);

      recognition.start();
    } catch (e) {
      console.error("Voice dictation error:", e);
      setIsListeningVoice(false);
    }
  };

  const handleExportAdvisorSession = () => {
    const header = `# The Pods Real Estate - Executive AI Advisor Report\n**Generated:** ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai GST)\n**Timeframe:** ${adPeriod.toUpperCase().replace('_', ' ')}\n**Meta Spend:** AED ${adMetrics.meta.spendAed.toLocaleString()} | **Impressions:** ${adMetrics.meta.impressions.toLocaleString()}\n\n---\n\n`;
    const body = advisorMessages.map((m) => {
      const author = m.role === "user" ? "### 👤 Minesh Patel (CEO)" : "### 🤖 AI Executive Advisor";
      const bullets = m.bullets ? m.bullets.map(b => `- ${b}`).join("\n") : "";
      return `${author}\n${m.text}\n${bullets ? `\n${bullets}` : ""}`;
    }).join("\n\n---\n\n");

    navigator.clipboard.writeText(header + body);
    setCopiedAdvisor(true);
    setTimeout(() => setCopiedAdvisor(false), 3000);
  };

  const handleQueryAdvisor = async (customQuery?: string) => {
    const q = customQuery || advisorQuery;
    if (!q.trim()) return;

    const userMsg = { role: "user" as const, text: q };
    const nextMessages = [...advisorMessages, userMsg];
    updateAdvisorMessages(nextMessages);
    if (!customQuery) setAdvisorQuery("");
    setLoadingAdvisor(true);

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: q,
          period: adPeriod,
          leadContext: selectedLead ? {
            fullName: selectedLead.fullName,
            phone: selectedLead.phone,
            budgetMax: selectedLead.budgetMax,
            buyerLocation: selectedLead.buyerLocation,
            status: selectedLead.status,
            aiEnabled: selectedLead.aiEnabled
          } : undefined
        }),
      });
      const data = await res.json();
      if (data.success) {
        updateAdvisorMessages([
          ...nextMessages,
          { role: "ai", text: data.answer, bullets: data.bullets }
        ]);
      } else {
        updateAdvisorMessages([
          ...nextMessages,
          { role: "ai", text: "Unable to process report query right now. Please try again." }
        ]);
      }
    } catch (e) {
      console.error("Advisor Error:", e);
      updateAdvisorMessages([
        ...nextMessages,
        { role: "ai", text: "Error connecting to AI Advisor service." }
      ]);
    } finally {
      setLoadingAdvisor(false);
    }
  };


  const handleTranscribeVoice = async (leadId: string) => {
    setLoadingVoice((prev) => ({ ...prev, [leadId]: true }));
    try {
      const res = await fetch("/api/ai/transcribe-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setVoiceData((prev) => ({ ...prev, [leadId]: data.result }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVoice((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  const handleMatchProjects = async (leadId: string, budgetMax?: number, buyerLocation?: string) => {
    setLoadingProjects((prev) => ({ ...prev, [leadId]: true }));
    try {
      const res = await fetch("/api/ai/match-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgetMax, buyerLocation }),
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setMatchedProjects((prev) => ({ ...prev, [leadId]: data.projects }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProjects((prev) => ({ ...prev, [leadId]: false }));
    }
  };

  const handleGenerateNudge = async (leadId?: string) => {
    setGeneratingNudge(true);
    try {
      const res = await fetch("/api/ai/generate-nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success && data.nudge) {
        setChatReplyInput(data.nudge);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingNudge(false);
    }
  };

  const handleSendManualReply = async () => {
    if (!chatReplyInput.trim() || !data?.conversations || data.conversations.length === 0) return;

    const currentConv = data.conversations[selectedConvIndex];
    if (!currentConv) return;

    const messageText = chatReplyInput.trim();
    setChatReplyInput("");

    const tempMsg = {
      id: `msg_manual_${Date.now()}`,
      senderType: "AI",
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI
    setData((prev: any) => {
      if (!prev || !prev.conversations) return prev;
      const updatedConvs = [...prev.conversations];
      if (updatedConvs[selectedConvIndex]) {
        updatedConvs[selectedConvIndex] = {
          ...updatedConvs[selectedConvIndex],
          messages: [...updatedConvs[selectedConvIndex].messages, tempMsg],
        };
      }
      return { ...prev, conversations: updatedConvs };
    });

    // Send to live WhatsApp API
    try {
      await fetch("/api/conversations/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConv.id,
          text: messageText,
        }),
      });
      fetchData();
    } catch (e) {
      console.error("Failed to send manual reply:", e);
    }
  };


  const handleTriggerTestBooking = async () => {
    setTestingBooking(true);
    setTestBookingMsg(null);
    try {
      const res = await fetch("/api/test-booking", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTestBookingMsg(`VIP Meeting Booked! Alert dispatched to ${data.notifiedPhone}`);
        fetchData();
        setTimeout(() => setTestBookingMsg(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestingBooking(false);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    setTestEmailMsg(null);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, resendApiKey }),
      });
      const data = await res.json();
      setTestEmailMsg(data.message);
      setTimeout(() => setTestEmailMsg(null), 7000);
    } catch (e) {
      setTestEmailMsg("Failed to dispatch test email");
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleSendTestWa = async () => {
    setSendingTestWa(true);
    setTestWaMsg(null);
    try {
      const res = await fetch("/api/test-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadPhone: adminPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestWaMsg(`WhatsApp booking alert dispatched to ${adminPhone}!`);
        fetchData();
        setTimeout(() => setTestWaMsg(null), 6000);
      }
    } catch (e) {
      setTestWaMsg("Failed to dispatch WhatsApp alert");
    } finally {
      setSendingTestWa(false);
    }
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.adminPhone) setAdminPhone(data.adminPhone);
        if (data.adminEmail) setAdminEmail(data.adminEmail);
        if (data.resendApiKey) setResendApiKey(data.resendApiKey);
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
        body: JSON.stringify({ adminPhone, adminEmail, resendApiKey }),
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
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      });
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
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    }, 10000); // 10s smart background-aware live refresh
    return () => clearInterval(interval);
  }, []);

  const stats = data?.stats || { totalLeads: 0, aiQualified: 0, handoffsRequired: 0, totalBookings: 0, totalVouchers: 0 };
  const leads = data?.recentLeads || [];
  const conversations = data?.conversations || [];
  const bookings = data?.bookings || [];

  // Dynamic filtered leads list based on search and status filters
  const filteredLeads = leads.filter((lead: any) => {
    if (leadStatusFilter !== "ALL" && lead.status !== leadStatusFilter) {
      return false;
    }
    if (leadAiFilter === "ACTIVE" && !lead.aiEnabled) return false;
    if (leadAiFilter === "PAUSED" && lead.aiEnabled) return false;

    if (leadSearchQuery.trim()) {
      const q = leadSearchQuery.toLowerCase();
      const name = (lead.fullName || "").toLowerCase();
      const phone = (lead.phone || "").toLowerCase();
      const location = (lead.buyerLocation || "").toLowerCase();
      const developer = (lead.preferredDeveloper || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !location.includes(q) && !developer.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Dynamic filtered conversations list based on search & mode
  const filteredConversations = conversations.filter((conv: any) => {
    const lead = conv.lead;
    if (convFilter === "AI" && lead && !lead.aiEnabled) return false;
    if (convFilter === "HUMAN" && lead && lead.aiEnabled) return false;

    if (convSearchQuery.trim()) {
      const q = convSearchQuery.toLowerCase();
      const name = (lead?.fullName || "").toLowerCase();
      const phone = (lead?.phone || "").toLowerCase();
      const lastMsg = (conv.messages?.[conv.messages.length - 1]?.content || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !lastMsg.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Auto-scroll ONLY when switching contact or when new message is added
  const prevMsgCountRef = useRef<number>(0);
  const currentMsgsLength = conversations[selectedConvIndex]?.messages?.length || 0;

  useEffect(() => {
    if (currentMsgsLength !== prevMsgCountRef.current) {
      chatScrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMsgCountRef.current = currentMsgsLength;
    }
  }, [selectedConvIndex, currentMsgsLength]);

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
    { id: "settings", name: "Alert Settings", icon: Sliders },
  ];

  if (isAuthenticated === null) {
    return <LuxuryLoader text="AUTHENTICATING EXECUTIVE COMMAND CENTER..." />;
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

          {/* Mobile Profile & Logout Footer */}
          <div className="pt-3 mt-3 border-t border-[#1E2230] flex items-center justify-between px-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1E2230] border border-[#C5A059]/40 flex items-center justify-center font-bold text-[11px] text-[#C5A059]">
                MP
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Minesh Patel</p>
                <p className="text-[9px] text-slate-400">info@thepodsrealestate.ae</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                localStorage.removeItem("pods_auth_token");
                router.push("/login");
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 active:scale-95 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
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
              <p className="text-[11px] text-[#C5A059] font-bold tracking-widest uppercase">Real Estate AI</p>
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#C5A059]/20 to-[#C5A059]/5 text-[#C5A059] border border-[#C5A059]/40 shadow-md font-bold"
                      : "text-slate-300 hover:text-white hover:bg-[#151824]"
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
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Lead Matrix System</h1>
                  <p className="text-xs text-slate-400 mt-1">Real-time deduplicated WhatsApp lead directory with instant action controls</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 font-mono">
                    Showing <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} leads
                  </span>
                  <a
                    href="/api/export/csv"
                    download="the_pods_leads_export.csv"
                    className="px-4 py-2.5 bg-[#151824] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Box */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearchQuery}
                    onChange={(e) => setLeadSearchQuery(e.target.value)}
                    placeholder="Search by name, phone, or location..."
                    className="w-full bg-[#151824] border border-[#1E2230] focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium"
                  />
                  {leadSearchQuery && (
                    <button
                      onClick={() => setLeadSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center space-x-1 bg-[#151824] p-1 rounded-xl border border-[#1E2230] text-[11px] font-bold">
                    {["ALL", "QUALIFIED", "NEW", "HOT", "BOOKED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setLeadStatusFilter(status)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          leadStatusFilter === status
                            ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 bg-[#151824] p-1 rounded-xl border border-[#1E2230] text-[11px] font-bold">
                    {[
                      { key: "ALL", label: "All AI" },
                      { key: "ACTIVE", label: "AI On" },
                      { key: "PAUSED", label: "AI Paused" },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => setLeadAiFilter(mode.key)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          leadAiFilter === mode.key
                            ? "bg-purple-600 text-white font-extrabold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Container */}
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
                        <th className="px-6 py-4">Last Activity</th>
                        <th className="px-6 py-4 text-right">Instant Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#1E2230]">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                            {leadSearchQuery || leadStatusFilter !== "ALL" || leadAiFilter !== "ALL"
                              ? "No matching leads found for current search/filter."
                              : "No leads found in database. Send a WhatsApp test message to see live records here!"}
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead: any) => {
                          const attribution = lead.attributions?.[0];
                          const source = lead.leadSource || attribution?.source || "DIRECT";
                          const campaign = attribution?.campaign || attribution?.utmCampaign || null;
                          const rawPhone = cleanWhatsAppPhone(lead.phone);

                          return (
                            <tr key={lead.id} className="hover:bg-[#151824]/50 transition-colors group">
                              {/* Lead Contact with Click-to-WhatsApp */}
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-[#151824] border border-[#C5A059]/30 flex items-center justify-center font-bold text-xs text-[#C5A059] shrink-0">
                                    {lead.fullName ? lead.fullName.slice(0, 2).toUpperCase() : "WA"}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{lead.fullName || "WhatsApp Lead"}</p>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                      <a
                                        href={`https://wa.me/${rawPhone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1 hover:underline"
                                        title="Open in WhatsApp Web"
                                      >
                                        <MessageCircle className="w-3 h-3 text-emerald-400" />
                                        <span>{lead.phone}</span>
                                      </a>
                                    </div>
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
                                    : lead.status === "HOT"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse"
                                    : lead.status === "BOOKED"
                                    ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30"
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

                              {/* Last Activity relative timestamp */}
                              <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                                <span className="inline-flex items-center space-x-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  <span>{formatTimeAgo(lead.updatedAt)}</span>
                                </span>
                              </td>

                              {/* Inline Actions */}
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleToggleAi(lead.id, lead.aiEnabled)}
                                    title={lead.aiEnabled ? "Pause AI for human takeover" : "Resume AI Concierge"}
                                    className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                                      lead.aiEnabled
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                                    }`}
                                  >
                                    {lead.aiEnabled ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                                  </button>

                                  <button
                                    onClick={() => {
                                      const convIdx = conversations.findIndex((c: any) => c.leadId === lead.id);
                                      if (convIdx !== -1) setSelectedConvIndex(convIdx);
                                      setActiveTab("conversations");
                                    }}
                                    title="Open WhatsApp Chat transcript"
                                    className="p-2 rounded-lg bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 hover:text-white transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                                  </button>

                                  <button
                                    onClick={() => { setSelectedLead(lead); setDrawerOpen(true); setIssuedVoucher(null); }}
                                    className="px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                  >
                                    <span>Dossier</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => { setDeleteModalLead(lead); setDeletePasscode(""); setDeleteError(null); setDeleteSuccessMsg(null); }}
                                    title="Delete Lead & Conversation (Password Protected)"
                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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
          )}

          {/* TAB 3: CONVERSATIONS */}
          {activeTab === "conversations" && (
            <div className="h-[calc(100vh-7.5rem)] md:h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6 max-w-7xl mx-auto overflow-hidden">
              {/* Left Thread List */}
              <div className={`w-full md:w-88 bg-[#0D0F17] border border-[#1E2230] rounded-2xl flex-col shadow-xl overflow-hidden select-none shrink-0 ${
                mobileShowChat ? "hidden md:flex" : "flex h-full"
              }`}>
                <div className="p-4 border-b border-[#1E2230] bg-[#151824] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">Active Threads</h3>
                      <p className="text-[11px] text-slate-400">Live WhatsApp Chat Feeds</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                      {filteredConversations.length} Active
                    </span>
                  </div>

                  {/* Search in conversations */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={convSearchQuery}
                      onChange={(e) => setConvSearchQuery(e.target.value)}
                      placeholder="Search chats by name or phone..."
                      className="w-full bg-[#0D0F17] border border-[#1E2230] focus:border-[#C5A059] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-1 bg-[#0D0F17] p-1 rounded-xl border border-[#1E2230] text-[10px] font-bold">
                    {[
                      { key: "ALL", label: "All Chats" },
                      { key: "AI", label: "AI Active" },
                      { key: "HUMAN", label: "Human Paused" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setConvFilter(btn.key)}
                        className={`flex-1 py-1 rounded-lg transition-all text-center ${
                          convFilter === btn.key
                            ? "bg-[#C5A059] text-black font-extrabold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-[#1E2230]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      {convSearchQuery || convFilter !== "ALL"
                        ? "No conversations match your search."
                        : "No active conversations in database yet."}
                    </div>
                  ) : (
                    filteredConversations.map((conv: any, idx: number) => {
                      const lastMsg = conv.messages?.[conv.messages.length - 1];
                      const isSelected = selectedConvIndex === idx;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setSelectedConvIndex(idx);
                            setMobileShowChat(true);
                          }}
                          className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                            isSelected ? "bg-[#C5A059]/10 border-l-4 border-[#C5A059]" : "hover:bg-[#151824]/50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-white text-xs truncate max-w-[170px]">
                              {conv.lead?.fullName || conv.lead?.phone}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatTimeAgo(conv.updatedAt)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-1 italic">
                            {lastMsg ? lastMsg.content : "No messages yet"}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${conv.lead?.aiEnabled ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                              <span className="text-[10px] font-semibold uppercase text-slate-400">
                                {conv.lead?.aiEnabled ? "AI Active" : "Human Paused"}
                              </span>
                            </div>
                            {conv.lead?.buyerLocation && (
                              <span className="text-[9px] font-mono text-slate-400 bg-[#151824] px-1.5 py-0.5 rounded border border-[#1E2230]">
                                {conv.lead.buyerLocation}
                              </span>
                            )}
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

                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          conversations[selectedConvIndex]?.lead.aiEnabled
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}>
                          {conversations[selectedConvIndex]?.lead.aiEnabled ? "AI Active" : "Human Control"}
                        </span>

                        <button
                          onClick={() => {
                            const curLead = conversations[selectedConvIndex]?.lead;
                            if (curLead) {
                              setDeleteModalLead(curLead);
                              setDeletePasscode("");
                              setDeleteError(null);
                              setDeleteSuccessMsg(null);
                            }
                          }}
                          title="Delete Thread & Lead (Password Protected)"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors flex items-center space-x-1 text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#07080C]/60 h-0 min-h-0">
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
                            <p className="text-xs leading-relaxed whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatScrollEndRef} />
                    </div>

                    {/* AI Co-Pilot 1-Click Executive Reply Bar */}
                    <div className="p-4 border-t border-[#1E2230] bg-[#151824] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#C5A059] uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Executive Reply Co-Pilot</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateNudge(conversations[selectedConvIndex]?.lead?.id)}
                            disabled={generatingNudge}
                            className="px-3 py-1 bg-[#0D0F17] hover:bg-[#1E2230] border border-emerald-500/40 text-emerald-400 font-bold text-[11px] rounded-lg transition-all disabled:opacity-50"
                          >
                            {generatingNudge ? "Generating Nudge..." : "Generate 48h Nudge"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleGenerateAiSuggestions(conversations[selectedConvIndex]?.id)}
                            disabled={loadingSuggestions}
                            className="px-3 py-1 bg-[#0D0F17] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[11px] rounded-lg transition-all disabled:opacity-50"
                          >
                            {loadingSuggestions ? "Generating Options..." : "Generate 1-Click Replies"}
                          </button>
                        </div>
                      </div>

                      {aiSuggestions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {aiSuggestions.map((sug, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setChatReplyInput(sug.text)}
                              className="p-2.5 rounded-xl bg-[#0D0F17] border border-[#1E2230] hover:border-[#C5A059]/50 text-left space-y-1 transition-all group"
                            >
                              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                                {sug.type}
                              </span>
                              <p className="text-xs text-slate-300 line-clamp-2 group-hover:text-white">
                                {sug.text}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendManualReply();
                        }}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="text"
                          value={chatReplyInput}
                          onChange={(e) => setChatReplyInput(e.target.value)}
                          placeholder="Type or select an AI Co-Pilot reply above..."
                          className="flex-1 bg-[#0D0F17] border border-[#1E2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                        />
                        <button
                          type="submit"
                          disabled={!chatReplyInput.trim()}
                          className="px-4 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow hover:brightness-110 disabled:opacity-50"
                        >
                          Send
                        </button>
                      </form>

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VIP BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">VIP Presentation Bookings</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Scheduled client presentations at Bluewaters Island Pods, London Office, and Google Meet
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 bg-[#151824] p-1 rounded-xl border border-[#1E2230] text-[11px] font-bold">
                    <button
                      onClick={() => setBookingViewMode("list")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        bookingViewMode === "list"
                          ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setBookingViewMode("calendar")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        bookingViewMode === "calendar"
                          ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Schedule View
                    </button>
                  </div>

                  <button
                    onClick={handleTriggerTestBooking}
                    disabled={testingBooking}
                    className="px-4 py-2 bg-[#151824] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{testingBooking ? "Simulating..." : "+ Simulate Test Booking"}</span>
                  </button>
                </div>
              </div>

              {testBookingMsg && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                  {testBookingMsg}
                </div>
              )}

              {bookingViewMode === "list" ? (
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-[#1E2230]">
                        <tr>
                          <th className="px-6 py-4">Client Contact</th>
                          <th className="px-6 py-4">Presentation Venue</th>
                          <th className="px-6 py-4">Scheduled Date & Time</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Instant Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#1E2230]">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                              No presentation bookings recorded yet.
                            </td>
                          </tr>
                        ) : (
                          bookings.map((b: any) => {
                            const rawPhone = cleanWhatsAppPhone(b.lead?.phone);
                            const isGoogleMeet = (b.location || "").toLowerCase().includes("meet") || (b.location || "").toLowerCase().includes("video");

                            return (
                              <tr key={b.id} className="hover:bg-[#151824]/50 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-white">{b.lead?.fullName || "VIP Client"}</p>
                                  <a
                                    href={`https://wa.me/${rawPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1 mt-0.5"
                                  >
                                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                                    <span>{b.lead?.phone}</span>
                                  </a>
                                </td>

                                <td className="px-6 py-4 text-xs font-semibold text-slate-200">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                                    <span>{b.location}</span>
                                  </div>
                                </td>

                                <td className="px-6 py-4 text-xs font-mono text-emerald-400 font-bold">
                                  {new Date(b.meetingTime).toLocaleString("en-GB", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>

                                <td className="px-6 py-4">
                                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    {b.status}
                                  </span>
                                </td>

                                <td className="px-6 py-4 text-right">
                                  <a
                                    href="https://calendar.app.google/xGRVwZCTkrnZCypUA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                  >
                                    <span>Google Calendar</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Grid Schedule View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookings.length === 0 ? (
                    <div className="col-span-full bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-12 text-center text-slate-500 text-sm">
                      No upcoming presentation slots booked.
                    </div>
                  ) : (
                    bookings.map((b: any) => (
                      <div key={b.id} className="bg-[#0D0F17] border border-[#1E2230] hover:border-[#C5A059]/50 rounded-2xl p-5 shadow-xl space-y-3 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-white">{b.lead?.fullName || "VIP Client"}</h4>
                            <p className="text-xs text-slate-400 font-mono">{b.lead?.phone}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Confirmed
                          </span>
                        </div>

                        <div className="bg-[#151824] p-3 rounded-xl border border-[#1E2230] space-y-1.5">
                          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(b.meetingTime).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span className="truncate">{b.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <a
                            href={`https://wa.me/${cleanWhatsAppPhone(b.lead?.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 hover:underline flex items-center space-x-1 font-medium"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>

                          <a
                            href="https://calendar.app.google/xGRVwZCTkrnZCypUA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#C5A059] hover:underline flex items-center space-x-1 font-medium"
                          >
                            <span>Calendar</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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

              {/* Sleek System Health Status Bar */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-bold text-slate-200">System Engine Status:</span>
                  <span className="text-emerald-400 font-semibold">Operational (100% SLA)</span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-slate-400 font-mono text-[11px]">
                  <div><span className="text-slate-500 uppercase mr-1">Avg Latency:</span><strong className="text-emerald-400">0.85s</strong></div>
                  <div><span className="text-slate-500 uppercase mr-1">Multilingual Detect:</span><strong className="text-[#C5A059]">100%</strong></div>
                  <div><span className="text-slate-500 uppercase mr-1">Supabase DB Sync:</span><strong className="text-white">Active</strong></div>
                </div>
              </div>

                {/* Multi-Channel Ad Intelligence & ROI Section */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <Megaphone className="w-5 h-5 text-[#C5A059]" />
                        <span>Multi-Channel Digital Ad Performance</span>
                      </h3>
                      <p className="text-xs text-slate-400">Live Meta Ads & Google Ads spend, CPL, and lead attribution metrics</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Date Filter Buttons */}
                      <div className="flex items-center bg-[#151824] border border-[#1E2230] p-1 rounded-xl text-[11px] font-bold">
                        {[
                          { key: "today", label: "Today" },
                          { key: "last_7d", label: "Last 7D" },
                          { key: "last_30d", label: "Last 30D" },
                          { key: "this_month", label: "This Month" },
                          { key: "maximum", label: "All Time" },
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            type="button"
                            onClick={() => handleSelectAdPeriod(btn.key)}
                            className={`px-2.5 py-1 rounded-lg transition-all ${
                              adPeriod === btn.key
                                ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setAdvisorOpen(true)}
                        className="px-3.5 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Ask AI Advisor</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Meta Ads Card */}
                    <div className="p-5 rounded-2xl bg-[#151824] border border-purple-500/30 space-y-3 relative overflow-hidden shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          Meta Ads (FB / IG)
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${adMetrics.meta.isLive ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {adMetrics.meta.isLive ? "Live API" : "Demo Fallback"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Ad Spend</p>
                          <p className="text-lg font-mono font-bold text-white">AED {adMetrics.meta.spendAed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Cost Per Lead (CPL)</p>
                          <p className="text-lg font-mono font-bold text-purple-400">AED {adMetrics.meta.cplAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Leads: <strong className="text-white">{adMetrics.meta.leads}</strong></span>
                        <span>CTR: <strong className="text-emerald-400">{adMetrics.meta.ctr}%</strong></span>
                      </div>
                    </div>

                    {/* Google Ads Card */}
                    <div className="p-5 rounded-2xl bg-[#151824] border border-red-500/30 space-y-3 relative overflow-hidden shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
                          Google Search Ads
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${adMetrics.google.isLive ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {adMetrics.google.isLive ? "Live API" : "Demo Fallback"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Ad Spend</p>
                          <p className="text-lg font-mono font-bold text-white">AED {adMetrics.google.spendAed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Cost Per Lead (CPL)</p>
                          <p className="text-lg font-mono font-bold text-red-400">AED {adMetrics.google.cplAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Leads: <strong className="text-white">{adMetrics.google.leads}</strong></span>
                        <span>CTR: <strong className="text-emerald-400">{adMetrics.google.ctr}%</strong></span>
                      </div>
                    </div>

                    {/* Total Combined Spend Card */}
                    <div className="p-5 rounded-2xl bg-[#151824] border border-[#C5A059]/40 space-y-3 relative overflow-hidden shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                          Combined Digital Total
                        </span>
                        <span className="text-[9px] font-mono bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full font-bold uppercase">Unified</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Total Spend</p>
                          <p className="text-lg font-mono font-bold text-[#C5A059]">AED {adMetrics.summary.totalSpendAed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Overall CPL</p>
                          <p className="text-lg font-mono font-bold text-white">AED {adMetrics.summary.overallCplAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Total Leads: <strong className="text-emerald-400">{adMetrics.summary.totalLeads}</strong></span>
                        <span>SLA: <strong className="text-[#C5A059]">Sub-10s</strong></span>
                      </div>
                    </div>
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
            </div>
          )}

          {/* TAB 6: ALERT SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Notification & Alert Settings</h1>
                <p className="text-xs text-slate-400 mt-1">Configure target WhatsApp numbers, email dispatchers, and test booking alerts</p>
              </div>

              {/* Notification Alert Settings Card */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Booking Alert & Notification Recipients</h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Set the target phone number and email where Minesh Patel will receive instant booking alerts
                  </p>
                </div>

                {settingsSaveMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                    {settingsSaveMsg}
                  </div>
                )}

                {testEmailMsg && (
                  <div className={`p-4 rounded-xl text-xs font-semibold ${
                    testEmailMsg.includes("successfully") || testEmailMsg.includes("dispatched")
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                  }`}>
                    {testEmailMsg}
                  </div>
                )}

                {testWaMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                    {testWaMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                      Notification Phone Number (WhatsApp / SMS)
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#151824] border border-[#1E2230] rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#C5A059] font-mono transition-colors"
                    />
                    <p className="text-xs text-slate-400 font-medium">Receives direct WhatsApp alert pings for new meeting bookings.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                      Notification Email Address
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="info@thepodsrealestate.ae"
                      className="w-full bg-[#151824] border border-[#1E2230] rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                    <p className="text-xs text-slate-400 font-medium">Receives Google Calendar event invitations and booking confirmations.</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                      <span>Resend Email Dispatch API Key (Optional)</span>
                      <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded ${resendApiKey ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400"}`}>
                        {resendApiKey ? "Live Resend Engine Active" : "Database Alert Logging Active"}
                      </span>
                    </label>
                    <input
                      type="password"
                      value={resendApiKey}
                      onChange={(e) => setResendApiKey(e.target.value)}
                      placeholder="re_123456789... (Leave blank to use Vercel RESEND_API_KEY)"
                      className="w-full bg-[#151824] border border-[#1E2230] rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#C5A059] font-mono transition-colors"
                    />
                    <p className="text-xs text-slate-400 font-medium">Enter your Resend API Key to deliver live booking alert emails directly to your inbox.</p>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSendTestEmail}
                      disabled={sendingTestEmail}
                      className="w-full sm:w-auto px-5 py-3 bg-[#151824] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs rounded-xl shadow hover:bg-[#1E2230] transition-all disabled:opacity-50"
                    >
                      {sendingTestEmail ? "Sending Email..." : "Send Test Email"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendTestWa}
                      disabled={sendingTestWa}
                      className="w-full sm:w-auto px-5 py-3 bg-[#151824] border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-xl shadow hover:bg-[#1E2230] transition-all disabled:opacity-50"
                    >
                      {sendingTestWa ? "Sending WhatsApp..." : "Send Test WhatsApp Ping"}
                    </button>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setDeleteModalLead(selectedLead);
                    setDeletePasscode("");
                    setDeleteError(null);
                    setDeleteSuccessMsg(null);
                  }}
                  title="Delete this Lead & All History (Password Protected)"
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors flex items-center space-x-1.5 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete Lead</span>
                </button>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Qualification Status</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Executive Intelligence Briefing Card */}
              <div className="p-5 rounded-2xl bg-[#151824] border border-[#C5A059]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Executive AI Briefing</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateLeadBriefing(selectedLead.id)}
                    disabled={loadingBriefing[selectedLead.id]}
                    className="px-3 py-1 bg-[#0D0F17] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[11px] rounded-lg transition-all disabled:opacity-50"
                  >
                    {loadingBriefing[selectedLead.id] ? "Analyzing..." : "Generate Briefing"}
                  </button>
                </div>

                {leadBriefings[selectedLead.id] ? (
                  <div className="space-y-3 pt-1 text-xs">
                    {/* Deal Heat Index Pill & Explanation */}
                    <div className="bg-[#0D0F17] p-3.5 rounded-xl border border-[#1E2230] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Deal Heat Index</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          leadBriefings[selectedLead.id].dealHeatScore === "HOT"
                            ? "bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/40"
                            : leadBriefings[selectedLead.id].dealHeatScore === "WARM"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}>
                          {leadBriefings[selectedLead.id].dealHeatScore} PRIORITY
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-normal leading-relaxed">
                        {leadBriefings[selectedLead.id].heatReason}
                      </p>
                    </div>

                    {/* Buying Intent */}
                    <div className="bg-[#0D0F17] p-3.5 rounded-xl border border-[#1E2230] space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buying Intent</span>
                      <p className="text-slate-200 font-normal leading-relaxed">{leadBriefings[selectedLead.id].buyingIntent}</p>
                    </div>

                    {/* Core Motivator */}
                    <div className="bg-[#0D0F17] p-3.5 rounded-xl border border-[#1E2230] space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Motivator</span>
                      <p className="text-slate-200 font-normal leading-relaxed">{leadBriefings[selectedLead.id].coreMotivator}</p>
                    </div>

                    {/* Recommended Action */}
                    <div className="bg-[#0D0F17] p-3.5 rounded-xl border border-[#C5A059]/30 space-y-1">
                      <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">Recommended Broker Action</span>
                      <p className="text-slate-200 font-medium leading-relaxed">{leadBriefings[selectedLead.id].recommendedAction}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Click "Generate Briefing" to run instant AI intent analysis and deal heat scoring for this lead.
                  </p>
                )}
              </div>

              {/* Feature 3: WhatsApp Voice Note Intelligence */}
              <div className="p-5 rounded-2xl bg-[#151824] border border-[#1E2230] space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-[#C5A059]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Voice Note Intelligence</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTranscribeVoice(selectedLead.id)}
                    disabled={loadingVoice[selectedLead.id]}
                    className="px-3 py-1 bg-[#0D0F17] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[10px] rounded-lg transition-all disabled:opacity-50"
                  >
                    {loadingVoice[selectedLead.id] ? "Transcribing Audio..." : "Transcribe Voice Note"}
                  </button>
                </div>

                {voiceData[selectedLead.id] ? (
                  <div className="space-y-2 pt-1 text-xs bg-[#0D0F17] p-3.5 rounded-xl border border-[#1E2230]">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-[#C5A059] uppercase">Voice Transcript</span>
                      <span className="font-mono">OpenAI Whisper Engine</span>
                    </div>
                    <p className="text-slate-200 italic">"{voiceData[selectedLead.id].transcript}"</p>
                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-[#1E2230] text-slate-300">
                      <div>Target: <span className="text-[#C5A059] font-semibold">{voiceData[selectedLead.id].extractedPropertyType}</span></div>
                      <div>Budget: <span className="text-emerald-400 font-semibold">{voiceData[selectedLead.id].extractedBudget}</span></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Click "Transcribe Voice Note" to process audio messages sent by this client into clean text and extracted criteria.
                  </p>
                )}
              </div>

              {/* Feature 5: AI Property Matcher & Payment Plan Calculator */}
              <div className="p-5 rounded-2xl bg-[#151824] border border-[#1E2230] space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Off-Plan Property Matcher</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMatchProjects(selectedLead.id, selectedLead.budgetMax, selectedLead.buyerLocation)}
                    disabled={loadingProjects[selectedLead.id]}
                    className="px-3 py-1 bg-[#0D0F17] hover:bg-[#1E2230] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[10px] rounded-lg transition-all disabled:opacity-50"
                  >
                    {loadingProjects[selectedLead.id] ? "Matching Projects..." : "Calculate Matches"}
                  </button>
                </div>

                {matchedProjects[selectedLead.id] ? (
                  <div className="space-y-3 pt-1 text-xs">
                    {matchedProjects[selectedLead.id].map((proj: any, idx: number) => (
                      <div key={idx} className="bg-[#0D0F17] p-3.5 rounded-xl border border-[#1E2230] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{proj.projectName}</span>
                          <span className="text-[10px] font-mono text-[#C5A059] font-bold">{proj.startingPrice}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{proj.developer} • {proj.location}</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#151824] p-2 rounded-lg text-slate-300">
                          <div>Down Payment (20%): <span className="text-white font-bold">{proj.downPayment}</span></div>
                          <div>Monthly (1%): <span className="text-emerald-400 font-bold">{proj.monthlyInstallment}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Click "Calculate Matches" to run instant AI project matching and payment plan calculations based on this lead's budget.
                  </p>
                )}
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

      {/* FLOATING LUXURY AI ACTION BALL (Fixed Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAdvisorOpen(!advisorOpen)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-black shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20"
          title="Open AI Executive Advisor"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* AI EXECUTIVE COMMAND CENTER DRAWER OVERLAY */}
      {advisorOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex justify-end transition-all">
          <div className="w-full max-w-xl bg-[#0D0F17] border-l border-[#1E2230] h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#1E2230] bg-[#151824] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white tracking-tight">AI Executive Advisor Console</h3>
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1E2230] text-slate-400 border border-[#2A2F42]">
                      ⌘K / Ctrl+K
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Multi-Channel Ad Intelligence & Strategic Real Estate Co-Pilot</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportAdvisorSession}
                  title="Copy formatted markdown report to clipboard"
                  className="px-2.5 py-1.5 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden sm:inline">{copiedAdvisor ? "Copied!" : "Export"}</span>
                </button>

                <button
                  onClick={handleClearAdvisorHistory}
                  title="Clear conversation history"
                  className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setAdvisorOpen(false)}
                  className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* SECTION 1: VISUAL MULTI-CHANNEL AD ROI COMPARISON GRAPH & SCORECARDS */}
              <div className="p-5 rounded-2xl bg-[#151824] border border-[#1E2230] space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-[#C5A059]" />
                    <span>Meta Ads vs Google Ads ROI Comparison</span>
                  </h4>
                  <div className="flex items-center space-x-1.5 bg-[#0D0F17] p-1 rounded-lg border border-[#1E2230] text-[10px] font-bold">
                    {[
                      { key: "today", label: "Today" },
                      { key: "last_7d", label: "7D" },
                      { key: "last_30d", label: "30D" },
                      { key: "this_month", label: "Month" },
                      { key: "maximum", label: "All" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => handleSelectAdPeriod(btn.key)}
                        className={`px-2 py-0.5 rounded transition-all ${
                          adPeriod === btn.key
                            ? "bg-[#C5A059] text-black font-extrabold shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Bar Comparison Chart */}
                <div className="space-y-3 bg-[#0D0F17] p-4 rounded-xl border border-[#1E2230]">
                  {/* Meta Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-purple-400 flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                        <span>Meta Ads (FB / IG)</span>
                      </span>
                      <span className="text-slate-300 font-mono">CPL: AED {adMetrics.meta.cplAed} ({adMetrics.meta.leads} leads)</span>
                    </div>
                    <div className="w-full bg-[#151824] rounded-full h-3.5 overflow-hidden border border-purple-500/30 p-0.5">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${Math.min(100, Math.round((adMetrics.meta.leads / (adMetrics.summary.totalLeads || 1)) * 100))}%` }}></div>
                    </div>
                  </div>

                  {/* Google Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#C5A059] flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-[#C5A059] inline-block"></span>
                        <span>Google Search Ads</span>
                      </span>
                      <span className="text-slate-300 font-mono">CPL: AED {adMetrics.google.cplAed} ({adMetrics.google.leads} leads)</span>
                    </div>
                    <div className="w-full bg-[#151824] rounded-full h-3.5 overflow-hidden border border-[#C5A059]/30 p-0.5">
                      <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4B06A] rounded-full" style={{ width: `${Math.min(100, Math.round((adMetrics.google.leads / (adMetrics.summary.totalLeads || 1)) * 100))}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-[#0D0F17] p-3 rounded-xl border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 uppercase">Total Digital Spend</span>
                    <p className="text-sm font-mono font-bold text-white">AED {adMetrics.summary.totalSpendAed.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0D0F17] p-3 rounded-xl border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 uppercase">Overall CPL</span>
                    <p className="text-sm font-mono font-bold text-emerald-400">AED {adMetrics.summary.overallCplAed}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: AI ADVISOR CHAT CONSOLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                    <span>Executive AI Query Console</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">GPT-4o-mini Grounded</span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1E2230] scrollbar-track-[#0D0F17]">
                  {advisorMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl text-xs space-y-2.5 shadow-xl transition-all ${
                        m.role === "user"
                          ? "bg-[#1E2230] text-slate-100 ml-8 border border-[#2A2F42]"
                          : "bg-[#151824] text-slate-200 border border-[#C5A059]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                        <span>{m.role === "user" ? "Minesh Patel (CEO)" : "AI Executive Advisor"}</span>
                      </div>
                      <div className="leading-relaxed space-y-2 text-slate-200">
                        {m.text.split("\n").map((line, lIdx) => (
                          line.trim() && <p key={lIdx}>{line}</p>
                        ))}
                      </div>
                      {m.bullets && m.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-2 border-t border-[#1E2230] text-[11px] text-slate-300">
                          {m.bullets.map((b, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-[#C5A059] font-bold">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                  {loadingAdvisor && (
                    <div className="p-4 rounded-2xl bg-[#151824] border border-[#C5A059]/40 text-xs text-[#C5A059] font-bold flex items-center space-x-2 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                      <span>Analyzing Ad APIs and Database Context...</span>
                    </div>
                  )}
                </div>
              </div>


              {/* SECTION 3: 1-CLICK PROMPT PILLS */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1-Click Executive Prompts</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQueryAdvisor("Compare Google Ads vs Meta Ads CPL and lead volume.")}
                    className="px-3 py-1.5 rounded-xl bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 text-xs transition-all hover:border-[#C5A059]"
                  >
                    Compare Google vs Meta CPL
                  </button>
                  <button
                    onClick={() => handleQueryAdvisor("How many HOT leads require viewing booking today?")}
                    className="px-3 py-1.5 rounded-xl bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 text-xs transition-all hover:border-[#C5A059]"
                  >
                    Summary of HOT Leads
                  </button>
                  <button
                    onClick={() => handleQueryAdvisor("Generate an executive 1-paragraph report for our sales meeting.")}
                    className="px-3 py-1.5 rounded-xl bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 text-xs transition-all hover:border-[#C5A059]"
                  >
                    Generate Board Report
                  </button>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#1E2230] bg-[#151824]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQueryAdvisor();
                }}
                className="flex items-center space-x-2"
              >
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  title={isListeningVoice ? "Listening... Click to stop" : "Click to speak your prompt"}
                  className={`p-3 rounded-xl border transition-all ${
                    isListeningVoice
                      ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                      : "bg-[#0D0F17] hover:bg-[#1E2230] border-[#1E2230] text-slate-400 hover:text-[#C5A059]"
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListeningVoice ? "animate-bounce" : ""}`} />
                </button>

                <input
                  type="text"
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  placeholder={isListeningVoice ? "Listening to your voice..." : "Ask AI Advisor about Google Ads, Meta Ads, or leads..."}
                  className="flex-1 bg-[#0D0F17] border border-[#1E2230] focus:border-[#C5A059] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loadingAdvisor || !advisorQuery.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 PASSWORD-PROTECTED DELETE LEAD MODAL */}
      {deleteModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0D0F17] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Delete Lead & Chat History</h3>
                <p className="text-xs text-slate-400 mt-0.5">Permanent admin deletion</p>
              </div>
            </div>

            <div className="bg-[#151824] border border-[#1E2230] rounded-2xl p-4 space-y-2">
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Lead Name:</span> <strong className="text-white ml-1">{deleteModalLead.fullName || "VIP Client"}</strong>
              </div>
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Phone:</span> <strong className="text-[#C5A059] font-mono ml-1">{deleteModalLead.phone}</strong>
              </div>
              <p className="text-[11px] text-rose-400/90 leading-relaxed pt-1.5 border-t border-[#1E2230]">
                ⚠️ This will permanently delete this lead, all WhatsApp chat transcripts, bookings, vouchers, and attribution records.
              </p>
            </div>

            {deleteSuccessMsg ? (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{deleteSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Enter Admin Passcode to Confirm
                  </label>
                  <input
                    type="password"
                    value={deletePasscode}
                    onChange={(e) => setDeletePasscode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleDeleteLead(); }}
                    placeholder="Enter login passcode..."
                    className="w-full bg-[#151824] border border-[#1E2230] focus:border-rose-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none font-mono transition-colors"
                    autoFocus
                  />
                </div>

                {deleteError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModalLead(null);
                      setDeletePasscode("");
                      setDeleteError(null);
                    }}
                    className="flex-1 py-3 bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!deletePasscode.trim() || isDeleting}
                    onClick={handleDeleteLead}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

