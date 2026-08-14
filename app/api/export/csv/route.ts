import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
