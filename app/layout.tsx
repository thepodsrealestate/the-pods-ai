import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Pods Real Estate — AI Command Center",
  description: "Luxury Real Estate AI Sales Concierge & Lead Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#07080C] text-slate-100 antialiased selection:bg-[#C5A059] selection:text-black">
        {children}
      </body>
    </html>
  );
}
