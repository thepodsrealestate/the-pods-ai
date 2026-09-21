"use client";

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
  Filter,
  Maximize2,
  Minimize2,
  TrendingUp,
  Sun,
  Moon
} from "lucide-react";

function SourceBadge({ source, compact = false }: { source: string; compact?: boolean }) {
  const upper = (source || "DIRECT").toUpperCase();

  if (upper.includes("WHATSAPP")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
        <svg className="w-2.5 h-2.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 2a10 10 0 0 0-8.59 15.11L2 22l4.99-1.31A10 10 0 1 0 12 2zm0 18a7.95 7.95 0 0 1-4.07-1.12l-.29-.17-3.02.79.81-2.94-.19-.3A7.96 7.96 0 1 1 12 20z"/>
        </svg>
        <span className="whitespace-nowrap">{compact ? "Direct" : "WhatsApp Direct"}</span>
      </span>
    );
  }

  if (upper.includes("INSTAGRAM")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
        <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-[2] shrink-0" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        <span className="whitespace-nowrap">{compact ? "IG" : "Instagram Ads"}</span>
      </span>
    );
  }

  if (upper.includes("FACEBOOK") || upper.includes("META")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
        <svg className="w-2.5 h-2.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="whitespace-nowrap">{compact ? "Meta" : "Facebook Ads"}</span>
      </span>
    );
  }

  if (upper.includes("GOOGLE")) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
        <svg className="w-2.5 h-2.5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
        </svg>
        <span className="whitespace-nowrap">{compact ? "Google" : "Google Search"}</span>
      </span>
    );
  }

  // Friendly formatter for campaign names & custom UTM sources
  let label = upper;
  if (upper.includes("DANUBE") && upper.includes("LEICESTER")) {
    label = "Danube Leicester Expo";
  } else if (upper.includes("GUJARATI") || upper.includes("LEICESTER_SHOW")) {
    label = "Leicester Gujarati Show";
  } else {
    label = upper.replace(/[-_]+/g, " ").trim();
  }

  return (
    <span
      className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 max-w-full min-w-0 truncate"
      title={source}
    >
      <Globe className="w-2.5 h-2.5 shrink-0" />
      <span className="truncate">{compact ? label.split(" ")[0] : label}</span>
    </span>
  );
}

function FormattedAdvisorMessage({ text, bullets }: { text: string; bullets?: string[] }) {
  const renderParagraph = (paragraph: string, pIdx: number) => {
    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={pIdx} className="leading-relaxed text-[12.5px] text-slate-200">
        {parts.map((part, idx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={idx} className="text-white font-bold tracking-tight">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  };

  const cleanBullets = (bullets || [])
    .map((b) => b.replace(/^[\s•\-\*\d\.\)]+/, "").trim())
    .filter(Boolean);

  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3.5">
      <div className="space-y-2.5">
        {paragraphs.map((p, idx) => renderParagraph(p, idx))}
      </div>

      {cleanBullets.length > 0 && (
        <div className="pt-3 border-t border-[#1E2230] space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#C5A059]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Priority Recommendations &amp; Action Items</span>
          </div>
          <div className="grid gap-2">
            {cleanBullets.map((bullet, i) => (
              <div
                key={i}
                className="bg-[#0D0F17]/80 hover:bg-[#0D0F17] border border-[#1E2230] hover:border-[#C5A059]/40 p-3 rounded-xl flex items-start space-x-3 transition-all text-[11.5px] text-slate-200 shadow-sm"
              >
                <span className="bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0 select-none mt-0.5">
                  0{i + 1}
                </span>
                <span className="leading-relaxed flex-1">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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

function getDirectInviteTemplate(leadName?: string | null) {
  const namePart = leadName ? ` ${leadName}` : "";
  return `Hello${namePart},

I hope you're keeping well. This is Chetan Sharma from The Pods Real Estate, in partnership with Danube Properties.

We're holding our Dubai Property Expo at the Marriott Hotel, Leicester (Smith Way, LE19 1SW) on 26th and 27th September, and I'd like to arrange a session for you with Mr Muza, one of our senior Danube specialists in UK.

Could you kindly confirm:
📅 Which date suits you — *26th* or *27th* September?
💻 Would you prefer to meet in person at the Marriott, or join via Zoom?

Once I have your preference, I'll get this booked in and send you a confirmation.

Kind regards,
Chetan Sharma
The Pods Real Estate`;
}

type ConversationMessage = {
  senderType: string;
  content?: string;
  createdAt: string | Date;
};

function deduplicateConsecutiveMessages<T extends ConversationMessage>(messages: T[]): T[] {
  return messages.filter((message, index) => {
    const previous = messages[index - 1];
    if (!previous || previous.senderType !== message.senderType) return true;

    const sameContent = (previous.content || "").trim().toLowerCase()
      === (message.content || "").trim().toLowerCase();
    const timeDifference = new Date(message.createdAt).getTime() - new Date(previous.createdAt).getTime();
    return !(sameContent && timeDifference >= 0 && timeDifference <= 10000);
  });
}

export default function MasterDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "conversations" | "bookings" | "analytics" | "settings">("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  // Mobile swipe-back gesture protection (prevents navigating back to /login)
  useEffect(() => {
    if (mobileShowChat) {
      window.history.pushState({ chatOpen: true }, "");
      const handlePopState = () => {
        setMobileShowChat(false);
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [mobileShowChat]);

  const chatScrollEndRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Lead Slide-Over Drawer States
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [issuedVoucher, setIssuedVoucher] = useState<any>(null);
  const [generatingVoucher, setGeneratingVoucher] = useState<boolean>(false);
  const [togglingAi, setTogglingAi] = useState<boolean>(false);
  const [globalAiMode, setGlobalAiMode] = useState<"DAY" | "NIGHT">("DAY");
  const [togglingGlobalMode, setTogglingGlobalMode] = useState<boolean>(false);

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
  const [leadChatFilter, setLeadChatFilter] = useState<string>("ALL"); // "ALL", "IN_CHAT", "FORM_ONLY"

  // Lead Pagination State
  const [leadPage, setLeadPage] = useState<number>(1);
  const [leadPageSize, setLeadPageSize] = useState<number>(25); // 25, 50, 100, 0 (0 = All)

  // Auto-reset pagination to Page 1 when filter, search or page size changes
  useEffect(() => {
    setLeadPage(1);
  }, [leadSearchQuery, leadStatusFilter, leadAiFilter, leadChatFilter, leadPageSize]);

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
  const [sendingChatReply, setSendingChatReply] = useState<boolean>(false);
  const [chatSendError, setChatSendError] = useState<string | null>(null);

  // Auto-resize composer textarea to fit pasted or multiline messages cleanly
  useEffect(() => {
    if (chatTextareaRef.current) {
      chatTextareaRef.current.style.height = "auto";
      const scrollH = chatTextareaRef.current.scrollHeight;
      chatTextareaRef.current.style.height = `${Math.min(Math.max(scrollH, 44), 220)}px`;
    }
  }, [chatReplyInput]);
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
  const [advisorFullscreen, setAdvisorFullscreen] = useState<boolean>(false);
  const [advisorActiveTab, setAdvisorActiveTab] = useState<'chat' | 'metrics'>('chat');
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
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'active' | 'all'>('active');

  useEffect(() => {
    fetchAdMetrics("last_30d");
  }, []);

  const fetchAdMetrics = async (periodToFetch?: string) => {
    const p = periodToFetch || adPeriod;
    setLoadingAdMetrics(true);
    try {
      const res = await fetch(`/api/integrations/ad-metrics?period=${p}&campaigns=1`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setAdMetrics(json.data);
        setAdCampaigns(json.data.campaigns || []);
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
      const author = m.role === "user" ? "### Minesh Patel (CEO)" : "### AI Executive Advisor";
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
    if (!chatReplyInput.trim() || !selectedConversation) return;

    const messageText = chatReplyInput.trim();
    setSendingChatReply(true);
    setChatSendError(null);

    try {
      const response = await fetch("/api/conversations/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          text: messageText,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.delivered) {
        throw new Error(result.error || "WhatsApp could not deliver this message");
      }

      setChatReplyInput("");
      if (chatTextareaRef.current) {
        chatTextareaRef.current.style.height = "44px";
      }
      setData((previous: any) => {
        if (!previous?.conversations) return previous;
        return {
          ...previous,
          conversations: previous.conversations.map((conversation: any) =>
            conversation.id === selectedConversation.id
              ? { ...conversation, messages: [...conversation.messages, result.message] }
              : conversation
          ),
        };
      });
    } catch (e: any) {
      console.error("Failed to send manual reply:", e);
      setChatSendError(e.message || "WhatsApp delivery failed. Your message was not recorded as sent.");
    } finally {
      setSendingChatReply(false);
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

    fetch("/api/settings/ai-mode")
      .then((res) => res.json())
      .then((data) => {
        if (data.mode) setGlobalAiMode(data.mode);
      })
      .catch((err) => console.error("Failed to load AI mode:", err));
  }, []);

  const handleToggleGlobalMode = async (newMode: "DAY" | "NIGHT") => {
    if (togglingGlobalMode || newMode === globalAiMode) return;
    setTogglingGlobalMode(true);
    const prevMode = globalAiMode;
    setGlobalAiMode(newMode); // Optimistic UI update
    try {
      const res = await fetch("/api/settings/ai-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      const data = await res.json();
      if (!res.ok || !data.mode) {
        setGlobalAiMode(prevMode);
      }
    } catch (e) {
      console.error("Failed to update global AI mode:", e);
      setGlobalAiMode(prevMode);
    } finally {
      setTogglingGlobalMode(false);
    }
  };

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
        setSelectedConversationId((currentId) => {
          const stillExists = json.conversations?.some((conversation: any) => conversation.id === currentId);
          return stillExists ? currentId : json.conversations?.[0]?.id || null;
        });
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
  const selectedConversation = conversations.find(
    (conversation: any) => conversation.id === selectedConversationId
  ) || null;

  // Dynamic filtered leads list based on search and status filters
  const filteredLeads = leads.filter((lead: any) => {
    if (leadStatusFilter !== "ALL" && lead.status !== leadStatusFilter) {
      return false;
    }
    if (leadAiFilter === "ACTIVE" && !lead.aiEnabled) return false;
    if (leadAiFilter === "PAUSED" && lead.aiEnabled) return false;

    const conversation = conversations.find((item: any) => item.leadId === lead.id);
    const hasActiveChat = Boolean(conversation && conversation.messages && conversation.messages.length > 0);
    if (leadChatFilter === "IN_CHAT" && !hasActiveChat) return false;
    if (leadChatFilter === "FORM_ONLY" && hasActiveChat) return false;

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

  // Lead Matrix Pagination
  const effectivePageSize = leadPageSize === 0 ? Math.max(1, filteredLeads.length) : leadPageSize;
  const leadTotalPages = Math.max(1, Math.ceil(filteredLeads.length / effectivePageSize));
  const safeLeadPage = Math.min(Math.max(1, leadPage), leadTotalPages);
  const leadStartIndex = (safeLeadPage - 1) * effectivePageSize;
  const paginatedLeads = leadPageSize === 0
    ? filteredLeads
    : filteredLeads.slice(leadStartIndex, leadStartIndex + effectivePageSize);

  // Dynamic filtered conversations list based on search & mode
  const filteredConversations = conversations.filter((conv: any) => {
    const lead = conv.lead;
    const lastMsg = conv.messages?.[conv.messages.length - 1];
    const needsReply = lastMsg?.senderType === "LEAD" || lead?.handoffStatus === true;

    if (convFilter === "NEEDS_REPLY" && !needsReply) return false;
    if (convFilter === "RESPONDED" && needsReply) return false;
    if (convFilter === "AI" && lead && !lead.aiEnabled) return false;
    if (convFilter === "HUMAN" && lead && lead.aiEnabled) return false;

    if (convSearchQuery.trim()) {
      const q = convSearchQuery.toLowerCase();
      const name = (lead?.fullName || "").toLowerCase();
      const phone = (lead?.phone || "").toLowerCase();
      const lastMsgContent = (lastMsg?.content || "").toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !lastMsgContent.includes(q)) {
        return false;
      }
    }


    return true;
  });

  // Auto-scroll ONLY when switching contact or when new message is added
  const prevMsgCountRef = useRef<number>(0);
  const currentMsgsLength = selectedConversation?.messages?.length || 0;

  useEffect(() => {
    if (currentMsgsLength !== prevMsgCountRef.current) {
      chatScrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMsgCountRef.current = currentMsgsLength;
    }
  }, [selectedConversationId, currentMsgsLength]);

  // Calculate Lead Source Distribution dynamically from DB leads
  const sourceCounts = leads.reduce((acc: Record<string, number>, lead: any) => {
    let source = (lead.leadSource || "DIRECT").toUpperCase().replace(/\s+/g, "_");
    if (source.includes("FACEBOOK") || source.includes("META")) source = "FACEBOOK_ADS";
    else if (source.includes("GOOGLE")) source = "GOOGLE_ADS";
    else if (source.includes("WHATSAPP")) source = "WHATSAPP_DIRECT";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  const totalLeadsCount = leads.length || 1;

  const navItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "leads", name: "Lead Pipeline", icon: Users },
    { id: "conversations", name: "Conversations", icon: MessageSquare },
    { id: "bookings", name: "VIP Presentations", icon: Calendar },
    { id: "analytics", name: "Marketing & ROI", icon: BarChart3 },
    { id: "settings", name: "Alert Settings", icon: Sliders },
  ];

  if (isAuthenticated === null) {
    return <LuxuryLoader text="AUTHENTICATING EXECUTIVE COMMAND CENTER..." />;
  }

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-[#C5A059] selection:text-black">
      
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="md:hidden bg-[#0D0F17] border-b border-[#1E2230] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
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

        {/* Mobile AI Mode Segmented Control */}
        <div className="flex items-center bg-[#07090E] p-0.5 rounded-full border border-[#202536] shadow-inner">
          <button
            type="button"
            onClick={() => handleToggleGlobalMode("DAY")}
            disabled={togglingGlobalMode}
            title="Day Mode: Human Marketing First"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 transition-all ${
              globalAiMode === "DAY"
                ? "bg-amber-500/20 border border-amber-400/50 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                : "text-slate-400 border border-transparent"
            }`}
          >
            <Sun className={`w-3 h-3 ${globalAiMode === "DAY" ? "text-amber-400 fill-amber-400/30" : "text-slate-400"}`} />
            <span>Day</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleGlobalMode("NIGHT")}
            disabled={togglingGlobalMode}
            title="Night Mode: Full AI Concierge"
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 transition-all ${
              globalAiMode === "NIGHT"
                ? "bg-indigo-500/20 border border-indigo-400/50 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.25)]"
                : "text-slate-400 border border-transparent"
            }`}
          >
            <Moon className={`w-3 h-3 ${globalAiMode === "NIGHT" ? "text-indigo-300 fill-indigo-300/30" : "text-slate-400"}`} />
            <span>Night</span>
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#151824] text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU - FIXED OVERLAY */}
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

      {/* DESKTOP SIDEBAR NAVIGATION */}
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
              <div className={`w-2 h-2 rounded-full ${globalAiMode === "DAY" ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`}></div>
              <span className="text-[11px] text-slate-300 font-medium">
                {globalAiMode === "DAY" ? "Day: Human First" : "Night: AI Concierge"}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase ${globalAiMode === "DAY" ? "text-amber-400" : "text-emerald-400"}`}>
              {globalAiMode}
            </span>
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

      {/* MAIN CONTENT AREA */}
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

          {/* FIGMA-GRADE LUXURY AI MODE TOGGLE */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center bg-[#07090E] p-1 rounded-full border border-[#202536] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.03)]">
              <button
                type="button"
                onClick={() => handleToggleGlobalMode("DAY")}
                disabled={togglingGlobalMode}
                title="Day Mode: Sends initial greeting and pauses AI so Chetan and marketing team can chat manually"
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 active:scale-[0.98] ${
                  globalAiMode === "DAY"
                    ? "bg-gradient-to-r from-amber-500/25 via-amber-600/20 to-amber-500/10 border border-amber-400/50 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.22)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#151824]/60 border border-transparent"
                }`}
              >
                <Sun className={`w-3.5 h-3.5 transition-transform ${globalAiMode === "DAY" ? "text-amber-400 fill-amber-400/30 scale-110" : "text-slate-500"}`} />
                <span>Day Mode: Human First</span>
                {globalAiMode === "DAY" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleToggleGlobalMode("NIGHT")}
                disabled={togglingGlobalMode}
                title="Night Mode: Full autonomous AI Concierge engages leads and books calendar meetings 24/7"
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 active:scale-[0.98] ${
                  globalAiMode === "NIGHT"
                    ? "bg-gradient-to-r from-indigo-500/25 via-indigo-600/20 to-purple-500/10 border border-indigo-400/50 text-indigo-200 shadow-[0_0_18px_rgba(99,102,241,0.22)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#151824]/60 border border-transparent"
                }`}
              >
                <Moon className={`w-3.5 h-3.5 transition-transform ${globalAiMode === "NIGHT" ? "text-indigo-300 fill-indigo-300/30 scale-110" : "text-slate-500"}`} />
                <span>Night Mode: AI Auto-Pilot</span>
                {globalAiMode === "NIGHT" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></span>
                )}
              </button>
            </div>
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
        <div className="p-4 md:p-8 pb-28 md:pb-8 flex-1">
          
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
                    {filteredLeads.length > 0 ? (
                      <>
                        Showing <strong className="text-white">{leadStartIndex + 1}–{Math.min(leadStartIndex + paginatedLeads.length, filteredLeads.length)}</strong> of <strong className="text-white">{filteredLeads.length}</strong> leads
                        {filteredLeads.length !== (stats.totalLeads || leads.length) && (
                          <span className="text-slate-500"> ({stats.totalLeads || leads.length} total)</span>
                        )}
                      </>
                    ) : (
                      <>Showing <strong className="text-white">0</strong> leads</>
                    )}
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

              {/* Search & Filter Bar - Figma Luxury Layout */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-3">
                {/* Row 1: Search Box + Optional Reset Pill */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      placeholder="Search leads by name, phone, or location..."
                      className="w-full bg-[#12141F] border border-[#1E2230] focus:border-[#C5A059] rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium focus:ring-1 focus:ring-[#C5A059]/30"
                    />
                    {leadSearchQuery && (
                      <button
                        onClick={() => setLeadSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {(leadSearchQuery || leadStatusFilter !== "ALL" || leadAiFilter !== "ALL" || leadChatFilter !== "ALL") && (
                    <button
                      onClick={() => {
                        setLeadSearchQuery("");
                        setLeadStatusFilter("ALL");
                        setLeadAiFilter("ALL");
                        setLeadChatFilter("ALL");
                      }}
                      className="px-3 py-2 text-[11px] font-bold text-[#C5A059] hover:text-white bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-xl transition-all flex items-center justify-center space-x-1.5 shrink-0 self-end sm:self-auto shadow-sm"
                    >
                      <X className="w-3 h-3" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Row 2: Touch-Scrollable Filter Groups */}
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 pt-2 border-t border-[#1E2230]/70">
                  {/* Lead Pipeline Stage Tabs */}
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 -mx-1 px-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold shrink-0 hidden sm:inline">Stage:</span>
                    <div className="inline-flex items-center p-1 bg-[#12141F] border border-[#1E2230] rounded-xl shrink-0 space-x-1">
                      {["ALL", "QUALIFIED", "NEW", "HOT", "BOOKED"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setLeadStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            leadStatusFilter === status
                              ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold shadow-sm"
                              : "text-slate-400 hover:text-white hover:bg-[#1E2230]/50"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Channel & AI Status Filters */}
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 -mx-1 px-1">
                    {/* WhatsApp Inbound / Form Filter */}
                    <div className="inline-flex items-center p-1 bg-[#12141F] border border-[#1E2230] rounded-xl shrink-0 space-x-1">
                      {[
                        { key: "ALL", label: "All Channel" },
                        { key: "IN_CHAT", label: "💬 In Chat" },
                        { key: "FORM_ONLY", label: "⚠️ Form Only" },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setLeadChatFilter(f.key)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                            leadChatFilter === f.key
                              ? f.key === "FORM_ONLY"
                                ? "bg-amber-500 text-black font-extrabold shadow-sm"
                                : f.key === "IN_CHAT"
                                ? "bg-emerald-500 text-black font-extrabold shadow-sm"
                                : "bg-[#23293D] text-white font-extrabold shadow-sm"
                              : "text-slate-400 hover:text-white hover:bg-[#1E2230]/50"
                          }`}
                        >
                          <span>{f.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* AI Concierge Mode Filter */}
                    <div className="inline-flex items-center p-1 bg-[#12141F] border border-[#1E2230] rounded-xl shrink-0 space-x-1">
                      {[
                        { key: "ALL", label: "All AI" },
                        { key: "ACTIVE", label: "⚡ On" },
                        { key: "PAUSED", label: "⏸️ Paused" },
                      ].map((mode) => (
                        <button
                          key={mode.key}
                          onClick={() => setLeadAiFilter(mode.key)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            leadAiFilter === mode.key
                              ? "bg-purple-600 text-white font-extrabold shadow-sm"
                              : "text-slate-400 hover:text-white hover:bg-[#1E2230]/50"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left text-sm text-slate-300">
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
                        paginatedLeads.map((lead: any) => {
                          const attribution = lead.attributions?.[0];
                          const rawSource = lead.leadSource || attribution?.source || "DIRECT";
                          const genericSources = ["DIRECT", "FACEBOOK_ADS", "META_ADS", "GOOGLE_ADS", "WHATSAPP_DIRECT", "ORGANIC"];
                          const isGeneric = genericSources.includes(rawSource.toUpperCase().trim());
                          const campaign = attribution?.campaign || attribution?.utmCampaign || (!isGeneric ? rawSource : null);
                          const rawPhone = cleanWhatsAppPhone(lead.phone);
                          const conversation = conversations.find((item: any) => item.leadId === lead.id);
                          const hasActiveChat = Boolean(conversation && conversation.messages && conversation.messages.length > 0);

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
                                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
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
                                      {hasActiveChat ? (
                                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                          <span>In WhatsApp Chat</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-bold text-amber-300">
                                          <AlertCircle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                          <span>Form Only (No WA)</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex flex-col space-y-1">
                                  <SourceBadge source={rawSource} />
                                  {campaign && (
                                    <span className="inline-flex items-center text-[10px] text-slate-300 font-medium space-x-1 truncate max-w-[200px]" title={campaign}>
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

                                  {hasActiveChat ? (
                                    <button
                                      onClick={() => {
                                        if (conversation) setSelectedConversationId(conversation.id);
                                        setActiveTab("conversations");
                                      }}
                                      title="Open WhatsApp Chat transcript"
                                      className="p-2 rounded-lg bg-[#151824] hover:bg-[#1E2230] border border-[#1E2230] text-slate-300 hover:text-white transition-colors"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                                    </button>
                                  ) : (
                                    <a
                                      href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(getDirectInviteTemplate(lead.fullName))}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Direct 1-Click WhatsApp: Send Leicester Expo invite directly from your WhatsApp"
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[11px] font-bold hidden sm:inline">Direct WA</span>
                                    </a>
                                  )}

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

                {/* Pagination & Controls Bar */}
                {filteredLeads.length > 0 && (
                  <div className="px-6 py-4 bg-[#151824]/60 border-t border-[#1E2230] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Page Size Selector & Count Info */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>Show:</span>
                        <div className="flex items-center space-x-1 bg-[#0D0F17] p-1 rounded-xl border border-[#1E2230]">
                          {[
                            { label: "25", value: 25 },
                            { label: "50", value: 50 },
                            { label: "100", value: 100 },
                            { label: "All", value: 0 },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => setLeadPageSize(opt.value)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                leadPageSize === opt.value
                                  ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black shadow-sm"
                                  : "text-slate-400 hover:text-white hover:bg-[#1E2230]"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <span className="text-xs text-slate-400 font-mono hidden md:inline">
                        Showing <strong className="text-white">{leadStartIndex + 1}</strong> to{" "}
                        <strong className="text-white">
                          {Math.min(leadStartIndex + paginatedLeads.length, filteredLeads.length)}
                        </strong>{" "}
                        of <strong className="text-white">{filteredLeads.length}</strong> leads
                      </span>
                    </div>

                    {/* Right: Page Navigation Controls */}
                    {leadPageSize !== 0 && leadTotalPages > 1 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setLeadPage((p) => Math.max(1, p - 1))}
                          disabled={safeLeadPage <= 1}
                          className="px-3 py-1.5 rounded-xl border border-[#1E2230] bg-[#0D0F17] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1E2230] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>

                        <div className="flex items-center space-x-1">
                          {Array.from({ length: leadTotalPages }, (_, i) => i + 1).map((pageNum) => {
                            // If more than 7 pages, compress with smart ellipsis
                            if (leadTotalPages > 7) {
                              const isFirst = pageNum === 1;
                              const isLast = pageNum === leadTotalPages;
                              const isNearCurrent = Math.abs(pageNum - safeLeadPage) <= 1;

                              if (!isFirst && !isLast && !isNearCurrent) {
                                if (pageNum === safeLeadPage - 2 || pageNum === safeLeadPage + 2) {
                                  return (
                                    <span key={pageNum} className="px-1 text-xs text-slate-500 font-bold">
                                      …
                                    </span>
                                  );
                                }
                                return null;
                              }
                            }

                            const isActive = pageNum === safeLeadPage;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setLeadPage(pageNum)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                  isActive
                                    ? "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black shadow-md"
                                    : "bg-[#0D0F17] border border-[#1E2230] text-slate-400 hover:text-white hover:bg-[#1E2230]"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setLeadPage((p) => Math.min(leadTotalPages, p + 1))}
                          disabled={safeLeadPage >= leadTotalPages}
                          className="px-3 py-1.5 rounded-xl border border-[#1E2230] bg-[#0D0F17] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1E2230] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CONVERSATIONS */}
          {activeTab === "conversations" && (
            <div className="h-[calc(100dvh-7.5rem)] md:h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-4 md:gap-6 max-w-7xl mx-auto overflow-hidden">
              {/* Left Thread List */}
              <div className={`w-full md:w-88 bg-[#0D0F17] border border-[#1E2230] rounded-2xl flex-col shadow-xl overflow-hidden select-none shrink-0 ${
                mobileShowChat ? "hidden md:flex" : "flex h-full"
              }`}>
                <div className="p-4 border-b border-[#1E2230] bg-[#151824] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">Active Threads</h3>
                      <p className="text-xs text-slate-400">Live WhatsApp Chat Feeds</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
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
                      className="w-full bg-[#0D0F17] border border-[#1E2230] focus:border-[#C5A059] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 bg-[#0D0F17] p-1 rounded-xl border border-[#1E2230] text-xs font-bold">
                    {[
                      { key: "ALL", label: "All" },
                      { key: "NEEDS_REPLY", label: "Needs Reply" },
                      { key: "RESPONDED", label: "Replied" },
                      { key: "AI", label: "AI Active" },
                      { key: "HUMAN", label: "Human" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setConvFilter(btn.key)}
                        className={`flex-1 py-1 px-1.5 rounded-lg transition-all text-center whitespace-nowrap ${
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
                    filteredConversations.map((conv: any) => {
                      const lastMsg = conv.messages?.[conv.messages.length - 1];
                      const isSelected = selectedConversationId === conv.id;
                      const needsReply = lastMsg?.senderType === "LEAD" || conv.lead?.handoffStatus === true;

                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setSelectedConversationId(conv.id);
                            setChatSendError(null);
                            setMobileShowChat(true);
                          }}
                          className={`p-4 cursor-pointer transition-colors space-y-1.5 relative ${
                            isSelected ? "bg-[#C5A059]/10 border-l-4 border-[#C5A059]" : "hover:bg-[#151824]/50"
                          } ${needsReply ? "bg-rose-950/10" : ""}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-1.5 truncate max-w-[170px]">
                              <span className="font-semibold text-white text-sm truncate">
                                {conv.lead?.fullName || conv.lead?.phone}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono shrink-0">
                              {formatTimeAgo(conv.updatedAt)}
                            </span>
                          </div>

                          <p className="text-sm text-slate-400 line-clamp-1">
                            {lastMsg ? lastMsg.content : "No messages yet"}
                          </p>
                          <div className="flex items-center justify-between pt-0.5">
                            {/* Status Indicator */}
                            <div className="flex items-center space-x-1.5">
                              {needsReply ? (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                  <span>Needs reply</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  <span>Replied</span>
                                </span>
                              )}
                            </div>

                            {/* Channel Source & Location Tag */}
                            <div className="flex items-center space-x-1.5 min-w-0 justify-end text-[10px] text-slate-400">
                              <SourceBadge source={conv.lead?.leadSource} compact={true} />
                              {conv.lead?.buyerLocation && (
                                <span className="text-[10px] font-mono text-slate-400 bg-[#121624] px-1.5 py-0.5 rounded border border-[#1E2230] truncate max-w-24">
                                  {conv.lead.buyerLocation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Transcript */}
              <div className={`flex-1 bg-[#090B12] border border-[#1E2538] rounded-2xl flex-col shadow-xl overflow-hidden ${
                mobileShowChat ? "flex h-full" : "hidden md:flex"
              }`}>
                {!selectedConversation ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2 p-8 bg-[#090B12]">
                    <MessageSquare className="w-10 h-10 text-[#C5A059]" />
                    <p className="text-sm font-semibold text-slate-400">No conversation selected</p>
                    <p className="text-xs text-slate-500 text-center max-w-sm">
                      Select a WhatsApp lead from the left feed to view the real-time transcript and send replies.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full">
                    {/* 2-Row Native Messenger Header */}
                    <div className="px-4 py-2.5 border-b border-[#1E2230] bg-[#111420] flex flex-col gap-1.5 shadow-sm">
                      {/* Row 1: Back + Avatar + Name + Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <button
                            onClick={() => setMobileShowChat(false)}
                            className="md:hidden p-1 -ml-1 text-[#C5A059] hover:text-white transition-colors shrink-0"
                            title="Back to Chats"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          {/* Contact Avatar Circle */}
                          {(() => {
                            const rawName = selectedConversation.lead?.fullName || "";
                            const cleanName = rawName.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
                            const initial = cleanName ? cleanName.charAt(0).toUpperCase() : (selectedConversation.lead?.phone?.slice(-2) || "VIP");

                            return (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F263B] to-[#121624] border border-[#C5A059]/40 flex items-center justify-center text-xs font-bold text-[#C5A059] shrink-0 shadow-sm">
                                {initial}
                              </div>
                            );
                          })()}

                          <h3 className="font-bold text-white text-sm sm:text-base truncate">
                            {selectedConversation.lead.fullName || selectedConversation.lead.phone}
                          </h3>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleAi(selectedConversation.lead?.id, selectedConversation.lead?.aiEnabled)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                              selectedConversation.lead.aiEnabled
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                            }`}
                            title="Toggle AI Automation"
                          >
                            {selectedConversation.lead.aiEnabled ? "Auto-Pilot ON" : "Manual"}
                          </button>

                          <button
                            onClick={() => {
                              const curLead = selectedConversation.lead;
                              if (curLead) {
                                setDeleteModalLead(curLead);
                                setDeletePasscode("");
                                setDeleteError(null);
                                setDeleteSuccessMsg(null);
                              }
                            }}
                            title="Delete Lead (Password Protected)"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Row 2: Metadata (Phone • Source • Campaign) */}
                      <div className="flex items-center space-x-2 pl-0 sm:pl-10 text-[11px] text-slate-400 overflow-hidden">
                        <span className="font-mono">{selectedConversation.lead.phone}</span>
                        <span className="text-slate-600">•</span>
                        <SourceBadge source={selectedConversation.lead.leadSource} compact={true} />
                        {(() => {
                          const attr = selectedConversation.lead.attributions?.[0];
                          const src = selectedConversation.lead.leadSource || attr?.source || "DIRECT";
                          const genSources = ["DIRECT", "FACEBOOK_ADS", "META_ADS", "GOOGLE_ADS", "WHATSAPP_DIRECT", "ORGANIC"];
                          const isGen = genSources.includes(src.toUpperCase().trim());
                          const camp = attr?.campaign || attr?.utmCampaign || (!isGen ? src : null);
                          return camp ? (
                            <>
                              <span className="text-slate-600">•</span>
                              <span className="inline-flex items-center space-x-1 text-[#C5A059] font-medium truncate max-w-[220px]" title={camp}>
                                <Megaphone className="w-3 h-3 shrink-0" />
                                <span className="truncate">{camp}</span>
                              </span>
                            </>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#07090F] h-0 min-h-0">
                      {(() => {
                        const rawMsgs = selectedConversation.messages || [];
                        const uniqueMsgs = deduplicateConsecutiveMessages(rawMsgs);
                        return uniqueMsgs.map((msg: any) => {
                          const isOutgoing = msg.senderType === "AI" || msg.senderType === "HUMAN_AGENT";
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] sm:max-w-[72%] p-3.5 sm:p-4 rounded-2xl shadow-md space-y-1.5 ${
                                  isOutgoing
                                    ? "bg-[#161B29] border border-[#C5A059]/30 text-slate-100 rounded-br-xs"
                                    : "bg-[#1A1F30] text-slate-200 rounded-bl-xs border border-[#252C42]"
                                }`}
                              >
                                <div className="flex items-center justify-between text-[11px] text-slate-400 space-x-3 pb-0.5 border-b border-white/5">
                                  <span className={`font-bold tracking-wider uppercase ${isOutgoing ? "text-[#C5A059]" : "text-slate-300"}`}>
                                    {msg.senderType === "AI" ? "Aria (AI Concierge)" : msg.senderType === "HUMAN_AGENT" ? "The Pods Team" : selectedConversation.lead?.fullName || "Lead"}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-line text-slate-100">{msg.content}</p>
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div ref={chatScrollEndRef} />
                    </div>

                    {/* Compact Luxury Bottom Composer & Co-Pilot */}
                    <div className="p-3 sm:p-4 border-t border-[#1E2230] bg-[#111420] space-y-2">
                      {/* AI Quick Actions Bar */}
                      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                        <button
                          type="button"
                          onClick={() => handleGenerateAiSuggestions(selectedConversation.id)}
                          disabled={loadingSuggestions}
                          className="px-2.5 py-1 bg-[#161B29] hover:bg-[#1E2333] border border-[#C5A059]/40 text-[#C5A059] font-bold text-[11px] rounded-lg transition-all flex items-center space-x-1 disabled:opacity-50 shrink-0"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{loadingSuggestions ? "Generating..." : "Suggest Reply"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateNudge(selectedConversation.lead?.id)}
                          disabled={generatingNudge}
                          className="px-2.5 py-1 bg-[#161B29] hover:bg-[#1E2333] border border-emerald-500/40 text-emerald-400 font-bold text-[11px] rounded-lg transition-all disabled:opacity-50 shrink-0"
                        >
                          <span>{generatingNudge ? "Generating..." : "Follow-up Nudge"}</span>
                        </button>
                      </div>

                      {aiSuggestions.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#090B10] rounded-xl border border-[#1E2230]">
                          {aiSuggestions.map((sug, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setChatReplyInput(sug.text)}
                              className="p-2 rounded-lg bg-[#161B29] border border-[#1E2230] hover:border-[#C5A059]/50 text-left space-y-0.5 transition-all group"
                            >
                              <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-wider block">
                                {sug.type}
                              </span>
                              <p className="text-[11px] text-slate-300 line-clamp-2 group-hover:text-white">
                                {sug.text}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}

                      {chatSendError && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
                          {chatSendError}
                        </div>
                      )}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendManualReply();
                        }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-end space-x-2">
                          <textarea
                            ref={chatTextareaRef}
                            rows={1}
                            value={chatReplyInput}
                            onChange={(e) => setChatReplyInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendManualReply();
                              }
                            }}
                            placeholder="Type or paste a message... (Shift + Enter for new line, Enter to send)"
                            className="flex-1 min-w-0 bg-[#090B10] border border-[#23293D] focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all resize-none leading-relaxed overflow-y-auto min-h-[44px] max-h-56"
                          />
                          <button
                            type="submit"
                            disabled={!chatReplyInput.trim() || sendingChatReply}
                            className="h-[44px] px-4 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-md hover:brightness-110 disabled:opacity-50 shrink-0 transition-all flex items-center justify-center space-x-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{sendingChatReply ? "..." : "Send"}</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
                          <span>
                            Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-slate-300">Shift + Enter</kbd> for line break &bull; <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-slate-300">Enter</kbd> to send
                          </span>
                          {chatReplyInput.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {chatReplyInput.length} chars
                            </span>
                          )}
                        </div>
                      </form>

                    </div>
                  </div>
                )}
              </div>

              {/* Column 3: Lead Profile & Quick Cockpit Actions (Visible on XL Desktop) */}
              {selectedConversation && (
                <div className="hidden xl:flex w-80 shrink-0 bg-[#0D101A] border border-[#1A2030] rounded-2xl flex-col shadow-xl overflow-y-auto p-4 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E2230]">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider">Lead Profile</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedConversation.lead?.aiEnabled
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}>
                      {selectedConversation.lead?.aiEnabled ? "Auto-Pilot ON" : "Manual"}
                    </span>
                  </div>

                  {/* Profile Summary Card */}
                  <div className="bg-[#141826] rounded-xl p-3.5 border border-[#1E2438] space-y-2.5">
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {selectedConversation.lead?.fullName || "VIP Client"}
                      </h3>
                      <p className="text-xs text-[#C5A059] font-mono mt-0.5">
                        {selectedConversation.lead?.phone}
                      </p>
                      {selectedConversation.lead?.email && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {selectedConversation.lead.email}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Location</span>
                        <span className="text-slate-200 font-semibold">{selectedConversation.lead?.buyerLocation || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Purpose</span>
                        <span className="text-slate-200 font-semibold">{selectedConversation.lead?.purchasePurpose || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Budget</span>
                        <span className="text-[#C5A059] font-bold">
                          {selectedConversation.lead?.budgetMin 
                            ? `AED ${(selectedConversation.lead.budgetMin / 1000000).toFixed(1)}M+` 
                            : selectedConversation.lead?.budgetMax 
                            ? `AED ${(selectedConversation.lead.budgetMax / 1000000).toFixed(1)}M` 
                            : "Not disclosed"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Timeline</span>
                        <span className="text-slate-200 font-semibold">{selectedConversation.lead?.timeline || "Not specified"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ad Attribution Intelligence */}
                  <div className="bg-[#141826] rounded-xl p-3 border border-[#1E2438] space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acquisition Source</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{selectedConversation.lead?.leadSource || "Direct WhatsApp"}</span>
                      <SourceBadge source={selectedConversation.lead?.leadSource} compact={true} />
                    </div>
                    {selectedConversation.lead?.meetingPreference && (
                      <div className="pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 block">Requested Session:</span>
                        <span className="text-emerald-400 font-semibold text-[11px]">{selectedConversation.lead.meetingPreference}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Cockpit Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedLead(selectedConversation.lead);
                        setDrawerOpen(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#141826] hover:bg-[#1E2438] border border-[#1E2438] hover:border-[#C5A059]/40 text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>View Full Lead Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("bookings");
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C5A059]/20 to-[#D4B06A]/20 hover:from-[#C5A059]/30 hover:to-[#D4B06A]/30 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule VIP Presentation</span>
                    </button>

                    <button
                      onClick={() => handleToggleAi(selectedConversation.lead?.id, selectedConversation.lead?.aiEnabled)}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                        selectedConversation.lead?.aiEnabled
                          ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                      }`}
                    >
                      <span>{selectedConversation.lead?.aiEnabled ? "Switch to Manual Takeover" : "Resume AI Auto-Pilot"}</span>
                    </button>
                  </div>
                </div>
              )}
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
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    b.status === "PENDING_APPROVAL"
                                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  }`}>
                                    {b.status === "PENDING_APPROVAL" ? "Awaiting Minesh Approval" : b.status || "Confirmed"}
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
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            b.status === "PENDING_APPROVAL"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {b.status === "PENDING_APPROVAL" ? "Awaiting Approval" : "Confirmed"}
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
                          <p className="text-[10px] text-slate-400 uppercase">{adMetrics.meta.leads > 0 ? "Cost Per Lead (CPL)" : "Cost Per Click (CPC)"}</p>
                          <p className="text-lg font-mono font-bold text-purple-400">AED {adMetrics.meta.leads > 0 ? adMetrics.meta.cplAed : adMetrics.meta.cpcAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Clicks: <strong className="text-white">{adMetrics.meta.clicks.toLocaleString()}</strong></span>
                        <span>Impr: <strong className="text-white">{adMetrics.meta.impressions.toLocaleString()}</strong></span>
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
                          <p className="text-[10px] text-slate-400 uppercase">{adMetrics.google.leads > 0 ? "Cost Per Lead (CPL)" : "Cost Per Click (CPC)"}</p>
                          <p className="text-lg font-mono font-bold text-red-400">AED {adMetrics.google.leads > 0 ? adMetrics.google.cplAed : adMetrics.google.cpcAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Clicks: <strong className="text-white">{adMetrics.google.clicks.toLocaleString()}</strong></span>
                        <span>Impr: <strong className="text-white">{adMetrics.google.impressions.toLocaleString()}</strong></span>
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
                          <p className="text-[10px] text-slate-400 uppercase">{adMetrics.summary.totalLeads > 0 ? "Overall CPL" : "Overall CPC"}</p>
                          <p className="text-lg font-mono font-bold text-white">AED {adMetrics.summary.totalLeads > 0 ? adMetrics.summary.overallCplAed : adMetrics.summary.overallCpcAed}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-[#1E2230] pt-2 font-mono">
                        <span>Total Clicks: <strong className="text-emerald-400">{adMetrics.summary.totalClicks?.toLocaleString() || 0}</strong></span>
                        <span>SLA: <strong className="text-[#C5A059]">Sub-10s</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead traffic source distribution */}
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">Lead Traffic Source Attribution</h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Ad platforms and marketing campaign performance metrics</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                    {Object.entries(sourceCounts).map(([src, count]: [string, any]) => {
                      const percentage = Math.round((count / totalLeadsCount) * 100);
                      
                      let barColor = "bg-[#C5A059]";
                      if (src.includes("FACEBOOK")) barColor = "bg-blue-500";
                      else if (src.includes("INSTAGRAM")) barColor = "bg-purple-500";
                      else if (src.includes("GOOGLE")) barColor = "bg-red-500";

                      return (
                        <div key={src} className="p-3.5 sm:p-4 rounded-xl bg-[#12141F] border border-[#1E2230] hover:border-[#2A3146] transition-all space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1 overflow-hidden">
                              <SourceBadge source={src} />
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-slate-300 font-mono text-xs font-bold whitespace-nowrap">
                                {count} <span className="text-slate-500 text-[10px] font-normal">({percentage}%)</span>
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-[#1A1D2B] rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Campaign-Level Breakdown Table & Mobile Cards */}
                {adCampaigns.length > 0 && (
                <div className="bg-[#0D0F17] border border-[#1E2230] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                        <Megaphone className="w-4 h-4 text-[#C5A059]" />
                        <span>Individual Campaign Performance</span>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Live per-campaign breakdown from Meta &amp; Google Ads APIs</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      <div className="flex items-center bg-[#151824] p-0.5 rounded-lg border border-[#1E2230]">
                        <button
                          type="button"
                          onClick={() => setCampaignStatusFilter('active')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                            campaignStatusFilter === 'active'
                              ? 'bg-[#C5A059] text-black shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Active Only ({adCampaigns.filter((c: any) => c.status === 'Active').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCampaignStatusFilter('all')}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                            campaignStatusFilter === 'all'
                              ? 'bg-[#C5A059] text-black shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          All ({adCampaigns.length})
                        </button>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Live API</span>
                    </div>
                  </div>

                  {/* MOBILE VIEW: Luxury Card List */}
                  <div className="block sm:hidden space-y-3 pt-1">
                    {adCampaigns
                      .filter((c: any) => {
                        if (campaignStatusFilter === 'all') return true;
                        return c.status === 'Active';
                      })
                      .sort((a: any, b: any) => b.spend - a.spend)
                      .map((c: any, idx: number) => (
                        <div
                          key={`mob-${c.platform}-${c.campaignId}-${idx}`}
                          className="p-3.5 rounded-xl bg-[#12141E] border border-[#1E2230] space-y-2.5 shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  c.platform === 'meta'
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {c.platform === 'meta' ? 'Meta' : 'Google'}
                              </span>
                              {c.status && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                    c.status === 'Active'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  {c.status}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-mono">Spend</span>
                              <span className="font-mono text-xs font-bold text-white">AED {c.spend.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="text-xs font-medium text-slate-100 leading-snug">
                            {c.campaignName}
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2230]/70">
                            <div className="bg-[#151824] p-2 rounded-lg text-center">
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Leads</span>
                              <span className="text-xs font-bold text-[#C5A059] font-mono">
                                {c.leads > 0 ? c.leads.toLocaleString() : '—'}
                              </span>
                            </div>
                            <div className="bg-[#151824] p-2 rounded-lg text-center">
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">CPL</span>
                              <span className="text-xs font-bold text-emerald-400 font-mono">
                                {c.cpl > 0 ? `AED ${c.cpl.toLocaleString()}` : '—'}
                              </span>
                            </div>
                            <div className="bg-[#151824] p-2 rounded-lg text-center">
                              <span className="text-[9px] text-slate-400 block font-mono uppercase">Clicks / CTR</span>
                              <span className="text-xs font-semibold text-slate-200 font-mono">
                                {c.clicks.toLocaleString()} <span className="text-[10px] text-emerald-400">({c.ctr}%)</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* DESKTOP/TABLET VIEW: Full Data Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-xs min-w-[700px]">
                      <thead>
                        <tr className="border-b border-[#1E2230] text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="text-left py-3 px-3">Platform</th>
                          <th className="text-left py-3 px-3">Campaign Name</th>
                          <th className="text-right py-3 px-3">Spend (AED)</th>
                          <th className="text-right py-3 px-3 text-[#C5A059]">Leads</th>
                          <th className="text-right py-3 px-3 text-emerald-400">CPL (AED)</th>
                          <th className="text-right py-3 px-3">Clicks</th>
                          <th className="text-right py-3 px-3">Impressions</th>
                          <th className="text-right py-3 px-3">CTR</th>
                          <th className="text-right py-3 px-3">CPC (AED)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adCampaigns
                          .filter((c: any) => {
                            if (campaignStatusFilter === 'all') return true;
                            return c.status === 'Active';
                          })
                          .sort((a: any, b: any) => b.spend - a.spend)
                          .map((c: any, idx: number) => (
                          <tr key={`${c.platform}-${c.campaignId}-${idx}`} className="border-b border-[#1E2230]/50 hover:bg-[#151824] transition-colors">
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                c.platform === 'meta'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
                              }`}>
                                {c.platform === 'meta' ? 'Meta' : 'Google'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-white font-medium max-w-[250px] truncate" title={c.campaignName}>
                              {c.campaignName}
                              {c.status && c.status !== 'Active' && (
                                <span className="ml-2 text-[9px] text-amber-400 font-mono">({c.status})</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-white">{c.spend.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-[#C5A059]">{c.leads > 0 ? c.leads.toLocaleString() : '\u2014'}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{c.cpl > 0 ? c.cpl.toLocaleString() : '\u2014'}</td>
                            <td className="py-3 px-3 text-right font-mono text-slate-300">{c.clicks.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right font-mono text-slate-300">{c.impressions.toLocaleString()}</td>
                            <td className="py-3 px-3 text-right font-mono text-emerald-400">{c.ctr}%</td>
                            <td className="py-3 px-3 text-right font-mono text-[#C5A059]">{c.cpc > 0 ? c.cpc : '\u2014'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}
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

      {/* LEAD DOSSIER & TAKEOVER SLIDE-OVER DRAWER */}
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
                  title="Delete this Lead (Password Protected)"
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
                      {selectedLead.budgetMax ? `AED ${selectedLead.budgetMax.toLocaleString()}` : selectedLead.budgetMin ? `AED ${(selectedLead.budgetMin / 1000000).toFixed(1)}M+` : "Not Disclosed"}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Location</span>
                    <p className="text-xs font-medium text-slate-200 mt-1">{selectedLead.buyerLocation || "Not Disclosed"}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#151824] border border-[#1E2230]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Traffic Source</span>
                    <div className="mt-1 flex flex-col space-y-1">
                      <SourceBadge source={selectedLead.leadSource || "DIRECT"} />
                      {(() => {
                        const attr = selectedLead.attributions?.[0];
                        const src = selectedLead.leadSource || attr?.source || "DIRECT";
                        const genSources = ["DIRECT", "FACEBOOK_ADS", "META_ADS", "GOOGLE_ADS", "WHATSAPP_DIRECT", "ORGANIC"];
                        const isGen = genSources.includes(src.toUpperCase().trim());
                        const camp = attr?.campaign || attr?.utmCampaign || (!isGen ? src : null);
                        return camp ? (
                          <span className="inline-flex items-center text-[10px] text-slate-300 font-medium space-x-1 truncate max-w-[180px]" title={camp}>
                            <Megaphone className="w-3 h-3 text-[#C5A059] shrink-0" />
                            <span className="truncate">{camp}</span>
                          </span>
                        ) : null;
                      })()}
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
            {(() => {
              const selectedConv = conversations.find((item: any) => item.leadId === selectedLead.id);
              const hasChat = Boolean(selectedConv && selectedConv.messages && selectedConv.messages.length > 0);
              const selRawPhone = cleanWhatsAppPhone(selectedLead.phone);

              return (
                <div className="p-4 border-t border-[#1E2230] bg-[#151824] space-y-2">
                  {hasChat ? (
                    <button
                      onClick={() => {
                        if (selectedConv) setSelectedConversationId(selectedConv.id);
                        setActiveTab("conversations");
                        setDrawerOpen(false);
                      }}
                      className="w-full py-3 bg-[#1E2230] hover:bg-[#2A2F42] text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                      <span>Open Live WhatsApp Chat Feed</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Form Submitted • No WhatsApp Inbound Yet</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          This lead filled your Facebook form but has not sent an inbound WhatsApp message yet. Reach out directly:
                        </p>
                      </div>
                      <a
                        href={`https://wa.me/${selRawPhone}?text=${encodeURIComponent(getDirectInviteTemplate(selectedLead.fullName))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Direct 1-Click WhatsApp Reachout (wa.me)</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* FLOATING LUXURY AI ACTION BALL (Fixed Bottom Right) */}
      <div className={`fixed bottom-20 right-4 sm:bottom-20 sm:right-6 md:bottom-6 md:right-6 z-30 ${activeTab === "conversations" && mobileShowChat ? "hidden md:block" : ""}`}>
        <button
          onClick={() => setAdvisorOpen(!advisorOpen)}
          className="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-black shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white/20"
          title="Open AI Executive Advisor"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[#0D0F17]"></span>
          </span>
        </button>
      </div>

      {/* NATIVE-APP MOBILE BOTTOM NAVIGATION BAR */}
      <nav aria-label="Mobile Navigation" className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0F17]/95 backdrop-blur-xl border-t border-[#1E2230] px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)] ${activeTab === "conversations" && mobileShowChat ? "hidden" : ""}`}>
        {[
          { id: "overview", name: "Overview", icon: LayoutDashboard },
          { id: "leads", name: "Leads", icon: Users },
          { id: "conversations", name: "Chats", icon: MessageSquare },
          { id: "bookings", name: "VIP", icon: Calendar },
          { id: "analytics", name: "Marketing", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setMobileShowChat(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-[#C5A059]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-[#C5A059]/15" : ""}`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059] stroke-[2.5]" : "text-slate-400"}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? "font-bold text-[#C5A059]" : "font-medium"}`}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* AI EXECUTIVE COMMAND CENTER OVERLAY (SIDE DRAWER & FULL SCREEN MODES) */}
      {advisorOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex transition-all duration-300 ${
            advisorFullscreen ? "items-center justify-center p-2 sm:p-6" : "justify-end"
          }`}
        >
          <div
            className={`bg-[#0D0F17] flex flex-col shadow-2xl transition-all duration-300 ${
              advisorFullscreen
                ? "w-full max-w-7xl h-full max-h-[94vh] rounded-3xl border border-[#C5A059]/40 overflow-hidden"
                : "w-full max-w-xl h-full border-l border-[#1E2230]"
            }`}
          >
            {/* Drawer / Fullscreen Header */}
            <div className="p-3.5 sm:p-5 border-b border-[#1E2230] bg-[#151824] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                      AI Executive Advisor
                    </h3>
                    {advisorFullscreen && (
                      <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                        Cockpit
                      </span>
                    )}
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1E2230] text-slate-400 border border-[#2A2F42]">
                      ⌘K
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Ad Intelligence &amp; Strategy Co-Pilot</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                {/* Fullscreen Expansion Toggle Button (Desktop only - mobile is already full-screen) */}
                <button
                  type="button"
                  onClick={() => setAdvisorFullscreen(!advisorFullscreen)}
                  title={advisorFullscreen ? "Exit Full Screen (Side Drawer)" : "Expand to Full Screen"}
                  className={`hidden sm:flex p-2 rounded-xl border transition-all items-center space-x-1.5 text-xs font-bold ${
                    advisorFullscreen
                      ? "bg-[#C5A059]/20 border-[#C5A059]/50 text-[#C5A059] shadow-sm"
                      : "bg-[#0D0F17] hover:bg-[#1E2230] border-[#1E2230] text-slate-300 hover:text-white"
                  }`}
                >
                  {advisorFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-[#C5A059]" />
                      <span className="hidden md:inline">Side View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 text-[#C5A059]" />
                      <span className="hidden md:inline">Full Screen</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExportAdvisorSession}
                  title="Copy formatted report to clipboard"
                  className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden sm:inline">{copiedAdvisor ? "Copied!" : "Export"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAdvisorHistory}
                  title="Clear conversation history"
                  className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAdvisorOpen(false)}
                  className="p-2 rounded-xl bg-[#0D0F17] hover:bg-[#1E2230] border border-[#1E2230] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Segmented Tab Switcher for Side Drawer (PC Compact) & Mobile Screen */}
            {!advisorFullscreen && (
              <div className="px-3.5 py-2.5 border-b border-[#1E2230] bg-[#111420] shrink-0">
                <div className="flex p-1 bg-[#090B10] rounded-xl border border-[#1E2230] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAdvisorActiveTab('chat')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      advisorActiveTab === 'chat'
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>AI Query Console</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvisorActiveTab('metrics')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      advisorActiveTab === 'metrics'
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Ad ROI &amp; Spend</span>
                  </button>
                </div>
              </div>
            )}

            {/* Content Container (2-Column in Fullscreen Cockpit, Tabbed in Side Drawer & Mobile) */}
            <div className={`flex-1 min-h-0 overflow-hidden ${advisorFullscreen ? "grid grid-cols-1 lg:grid-cols-12" : "flex flex-col"}`}>
              {/* METRICS & AD INTELLIGENCE PANEL */}
              {(advisorFullscreen || advisorActiveTab === 'metrics') && (
                <div
                  className={`p-4 sm:p-5 overflow-y-auto min-h-0 space-y-4 ${
                    advisorFullscreen ? "lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#1E2230] bg-[#0E1018]" : "flex-1 bg-[#0E1018]"
                  }`}
                >
                  {/* SECTION 1: VISUAL MULTI-CHANNEL AD ROI COMPARISON GRAPH & SCORECARDS */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#151824] border border-[#1E2230] space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-[#C5A059]" />
                        <span>Meta Ads vs Google Ads ROI</span>
                      </h4>
                      <div className="flex items-center space-x-1 bg-[#0D0F17] p-1 rounded-lg border border-[#1E2230] text-[10px] font-bold self-start sm:self-auto">
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
                    <div className="space-y-3 bg-[#0D0F17] p-3.5 sm:p-4 rounded-xl border border-[#1E2230]">
                      {/* Meta Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-purple-400 flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                            <span>Meta Ads</span>
                          </span>
                          <span className="text-slate-300 font-mono text-[11px]">
                            {adMetrics.meta.spendAed > 0 
                              ? `AED ${adMetrics.meta.spendAed.toLocaleString()} · ${adMetrics.meta.clicks} clicks` 
                              : `CPL: AED ${adMetrics.meta.cplAed}`}
                          </span>
                        </div>
                        <div className="w-full bg-[#151824] rounded-full h-3 overflow-hidden border border-purple-500/30 p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500" 
                            style={{ width: `${adMetrics.summary.totalSpendAed > 0 ? Math.max(5, Math.round((adMetrics.meta.spendAed / adMetrics.summary.totalSpendAed) * 100)) : 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Google Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#C5A059] flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-[#C5A059] inline-block"></span>
                            <span>Google Ads</span>
                          </span>
                          <span className="text-slate-300 font-mono text-[11px]">
                            {adMetrics.google.spendAed > 0 
                              ? `AED ${adMetrics.google.spendAed.toLocaleString()} · ${adMetrics.google.clicks} clicks` 
                              : `CPL: AED ${adMetrics.google.cplAed}`}
                          </span>
                        </div>
                        <div className="w-full bg-[#151824] rounded-full h-3 overflow-hidden border border-[#C5A059]/30 p-0.5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4B06A] rounded-full transition-all duration-500" 
                            style={{ width: `${adMetrics.summary.totalSpendAed > 0 ? Math.max(5, Math.round((adMetrics.google.spendAed / adMetrics.summary.totalSpendAed) * 100)) : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-[#0D0F17] p-3 rounded-xl border border-[#1E2230]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Total Digital Spend</span>
                        <p className="text-sm font-mono font-bold text-white mt-0.5">AED {adMetrics.summary.totalSpendAed.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#0D0F17] p-3 rounded-xl border border-[#1E2230]">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{adMetrics.summary.totalLeads > 0 ? "Overall CPL" : "Overall CPC"}</span>
                        <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">AED {adMetrics.summary.totalLeads > 0 ? adMetrics.summary.overallCplAed : adMetrics.summary.overallCpcAed}</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: 1-CLICK PROMPT CARDS (Detailed view) */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-[#151824]/60 border border-[#1E2230]">
                    <span className="text-[10px] font-extrabold text-[#C5A059] uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Executive Analysis Prompts</span>
                    </span>
                    <div className="flex flex-col space-y-2">
                      {[
                        { label: "Active Campaign Health & Strategy", query: "Diagnose our active campaign health, pacing, and 3 immediate strategic recommendations.", color: "text-[#C5A059] border-[#C5A059]/40 bg-[#C5A059]/10 hover:bg-[#C5A059]/20" },
                        { label: "Critique Live Ad Image & Creative", query: "Inspect our live ad image, headline, and creative copy using vision AI. Tell me how it looks and what design/copy flaws are hurting our CTR.", color: "text-purple-300 border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20" },
                        { label: "Diagnose 0-Lead Conversion", query: "Why do we have clicks but no form leads yet on our active campaign? How do we fix it?", color: "text-slate-300 border-[#1E2230] bg-[#0D0F17] hover:bg-[#1E2230]" },
                        { label: "Compare Google vs Meta CPL", query: "Compare Google Ads vs Meta Ads CPL and lead volume.", color: "text-slate-300 border-[#1E2230] bg-[#0D0F17] hover:bg-[#1E2230]" },
                        { label: "Executive Meeting Brief", query: "Generate an executive 1-paragraph report for our sales meeting.", color: "text-slate-300 border-[#1E2230] bg-[#0D0F17] hover:bg-[#1E2230]" },
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setAdvisorActiveTab('chat');
                            handleQueryAdvisor(prompt.query);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${prompt.color}`}
                        >
                          {prompt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!advisorFullscreen && (
                    <button
                      type="button"
                      onClick={() => setAdvisorActiveTab('chat')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open AI Query Console &rarr;</span>
                    </button>
                  )}
                </div>
              )}

              {/* CHAT CONSOLE & INPUT (Always visible in fullscreen right column, or when chat tab is selected) */}
              {(advisorFullscreen || advisorActiveTab === 'chat') && (
                <div
                  className={`flex flex-col min-h-0 flex-1 ${
                    advisorFullscreen ? "lg:col-span-7 h-full bg-[#111420] overflow-hidden" : "bg-[#111420]"
                  }`}
                >
                  {/* 1-Click Horizontal Carousel for Compact/Mobile Chat */}
                  <div className="flex items-center overflow-x-auto no-scrollbar space-x-2 px-3.5 py-2.5 bg-[#0D0F17] border-b border-[#1E2230] shrink-0">
                    <span className="text-[9px] font-extrabold uppercase text-[#C5A059] tracking-wider shrink-0 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden xs:inline">Quick:</span>
                    </span>
                    {[
                      { label: "Campaign Health", query: "Diagnose our active campaign health, pacing, and 3 immediate strategic recommendations." },
                      { label: "Critique Creative", query: "Inspect our live ad image, headline, and creative copy using vision AI. Tell me how it looks and what design/copy flaws are hurting our CTR." },
                      { label: "0-Lead Conversion", query: "Why do we have clicks but no form leads yet on our active campaign? How do we fix it?" },
                      { label: "Google vs Meta CPL", query: "Compare Google Ads vs Meta Ads CPL and lead volume." },
                      { label: "Meeting Brief", query: "Generate an executive 1-paragraph report for our sales meeting." },
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQueryAdvisor(prompt.query)}
                        className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#151824] hover:bg-[#1E2230] border border-[#C5A059]/30 hover:border-[#C5A059] text-slate-200 text-[11px] font-semibold transition-all shrink-0"
                      >
                        {prompt.label}
                      </button>
                    ))}
                  </div>

                  {/* Messages Thread (Takes 100% Remaining Height, Smooth Scrolling) */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 scrollbar-thin scrollbar-thumb-[#1E2230] scrollbar-track-[#0D0F17]">
                    {advisorMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 sm:p-5 rounded-2xl text-xs space-y-2.5 shadow-xl transition-all ${
                          m.role === "user"
                            ? "bg-[#1E2230] text-slate-100 ml-4 sm:ml-12 border border-[#2A2F42]"
                            : "bg-[#151824] text-slate-200 border border-[#C5A059]/40 shadow-[#C5A059]/5"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-[#C5A059] uppercase tracking-wider pb-2 border-b border-[#1E2230]/60">
                          <span className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${m.role === "user" ? "bg-slate-400" : "bg-[#C5A059]"}`}></span>
                            <span>{m.role === "user" ? "Minesh Patel (CEO)" : "AI Executive Advisor"}</span>
                          </span>
                          <span className="text-slate-500 font-normal">Real Estate Co-Pilot</span>
                        </div>

                        {/* Render formatted message content */}
                        <FormattedAdvisorMessage text={m.text} bullets={m.bullets} />
                      </div>
                    ))}

                    {loadingAdvisor && (
                      <div className="p-3.5 rounded-2xl bg-[#151824] border border-[#C5A059]/40 text-xs text-[#C5A059] font-bold flex items-center space-x-2.5 animate-pulse shadow-lg">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                        <span>Analyzing live Ad APIs, creatives, and CRM context...</span>
                      </div>
                    )}
                  </div>

                  {/* Input Bar (Cleanly Pinned with Safe Bottom Padding) */}
                  <div
                    className={`p-3 sm:p-4 border-t border-[#1E2230] bg-[#151824] shrink-0 ${
                      advisorFullscreen ? "pb-4 sm:pb-5 rounded-br-3xl" : "pb-safe"
                    }`}
                  >
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
                        className={`p-2.5 sm:p-3 rounded-xl border transition-all shrink-0 ${
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
                        className="flex-1 bg-[#0D0F17] border border-[#1E2230] focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 sm:py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                      <button
                        type="submit"
                        disabled={loadingAdvisor || !advisorQuery.trim()}
                        className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD-PROTECTED DELETE LEAD MODAL */}
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
              <p className="text-[11px] text-rose-400/90 leading-relaxed pt-1.5 border-t border-[#1E2230] flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>This will permanently delete this lead, all WhatsApp chat transcripts, bookings, vouchers, and attribution records.</span>
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

