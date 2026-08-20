import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // Defense-in-depth: check session cookie inside route handler
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionSecret = process.env.DASHBOARD_SESSION_SECRET || 'authenticated_minesh_pods_session_token_2026';
  const hasAuth = cookieHeader.includes(`pods_session=${sessionSecret}`);

  if (!hasAuth && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

  const headers = ["ID", "FullName", "Phone", "Status", "BuyerLocation", "BudgetMax", "Created At"];
  const rows = leads.map(l => [
    l.id,
    `"${l.fullName || 'Anonymous'}"`,
    `"${l.phone}"`,
    l.status,
    `"${l.buyerLocation || ''}"`,
    `"${l.budgetMax || ''}"`,
    l.createdAt.toISOString()
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="the_pods_leads_export.csv"'
    }
  });
}
