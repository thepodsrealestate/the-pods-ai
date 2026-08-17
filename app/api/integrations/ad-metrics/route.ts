import { NextResponse } from 'next/server';
import { metaAdsService } from '@/lib/services/metaAdsService';
import { googleAdsService } from '@/lib/services/googleAdsService';

export async function GET() {
  try {
    const [meta, google] = await Promise.all([
      metaAdsService.getMetrics(),
      googleAdsService.getMetrics(),
    ]);

    const totalSpendAed = meta.spendAed + google.spendAed;
    const totalLeads = meta.leads + google.leads;
    const overallCplAed = totalLeads > 0 ? parseFloat((totalSpendAed / totalLeads).toFixed(2)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSpendAed,
          totalLeads,
          overallCplAed,
        },
        meta,
        google,
      },
    });
  } catch (error: any) {
    console.error('Error fetching combined ad metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ad metrics' },
      { status: 500 }
    );
  }
}
