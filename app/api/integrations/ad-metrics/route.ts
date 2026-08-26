import { NextResponse } from 'next/server';
import { metaAdsService } from '@/lib/services/metaAdsService';
import { googleAdsService } from '@/lib/services/googleAdsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Production API route for live multi-channel ad metrics
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'last_30d';

    const [meta, google] = await Promise.all([
      metaAdsService.getMetrics(period),
      googleAdsService.getMetrics(period),
    ]);

    const totalSpendAed = parseFloat((meta.spendAed + google.spendAed).toFixed(2));
    const totalLeads = meta.leads + google.leads;
    const totalClicks = meta.clicks + google.clicks;
    const overallCplAed = totalLeads > 0 ? parseFloat((totalSpendAed / totalLeads).toFixed(2)) : 0;
    const overallCpcAed = totalClicks > 0 ? parseFloat((totalSpendAed / totalClicks).toFixed(2)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSpendAed,
          totalLeads,
          totalClicks,
          overallCplAed,
          overallCpcAed,
        },
        meta,
        google,
      },
    });
  } catch (error: any) {
    console.error('Error fetching combined ad metrics:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch ad metrics' },
      { status: 500 }
    );
  }
}
