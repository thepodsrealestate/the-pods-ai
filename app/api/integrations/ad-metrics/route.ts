import { NextResponse } from 'next/server';
import { metaAdsService } from '@/lib/services/metaAdsService';
import { googleAdsService } from '@/lib/services/googleAdsService';

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
    const overallCplAed = totalLeads > 0 ? parseFloat((totalSpendAed / totalLeads).toFixed(2)) : (meta.clicks + google.clicks > 0 ? parseFloat((totalSpendAed / (meta.clicks + google.clicks)).toFixed(2)) : 0);

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
