import React from 'react';

export default function LuxuryLoader({ text = "INITIALIZING EXECUTIVE COMMAND CENTER..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#07080C] flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Background Subtle Radial Gold Glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      {/* Luxury Logo Emblem Container */}
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm text-center">
        <div className="relative">
          {/* Outer Pulsing Metallic Ring */}
          <div className="w-20 h-20 rounded-2xl bg-[#0D0F17] border border-[#C5A059]/40 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent animate-shimmer"></div>
            
            {/* Pods Crest Icon */}
            <svg className="w-10 h-10 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22V12a6 6 0 0 1 12 0v10" />
              <path d="M12 2v4" />
              <path d="M4 22h16" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>

          {/* Glowing dot status */}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-[#07080C] shadow-lg animate-ping"></div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-[#07080C] shadow-lg"></div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-[0.25em] text-[#C5A059] uppercase">
            THE PODS
          </h2>
          <p className="text-[10px] font-bold tracking-[0.35em] text-slate-300 uppercase">
            REAL ESTATE AI
          </p>
        </div>

        {/* Subtle Animated Progress Line */}
        <div className="w-48 bg-[#1E2230] h-1 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#E2C384] w-full animate-pulse rounded-full"></div>
        </div>

        {/* Status Tagline */}
        <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase animate-pulse">
          {text}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[9px] font-mono tracking-wider text-slate-400 uppercase">
        THE PODS LUXURY REAL ESTATE DESKS • DUBAI & LONDON
      </div>
    </div>
  );
}
