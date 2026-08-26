import { GoogleAdsApi } from 'google-ads-api';

export interface GoogleAdsMetrics {
  spendAed: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cplAed: number;
  isLive: boolean;
  errorMessage?: string;
}

export class GoogleAdsService {
  private static instance: GoogleAdsService;

  private constructor() {}

  public static getInstance(): GoogleAdsService {
    if (!GoogleAdsService.instance) {
      GoogleAdsService.instance = new GoogleAdsService();
    }
    return GoogleAdsService.instance;
  }

  public async getMetrics(period: string = 'last_30d'): Promise<GoogleAdsMetrics> {
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID || '1670553891').replace(/-/g, '');
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

    if (clientId && clientSecret && developerToken && refreshToken && customerId) {
      try {
        const client = new GoogleAdsApi({
          client_id: clientId,
          client_secret: clientSecret,
          developer_token: developerToken,
        });

        const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '') || undefined;
        const customer = client.Customer({
          customer_id: customerId,
          login_customer_id: loginCustomerId,
          refresh_token: refreshToken,
        });

        let dateClause = 'DURING THIS_MONTH';
        const p = period.toLowerCase();
        if (p === 'today' || p === '1d') {
          dateClause = 'DURING TODAY';
        } else if (p === 'last_7d' || p === '7d' || p === 'week') {
          dateClause = 'DURING LAST_7_DAYS';
        } else if (p === 'last_30d' || p === '30d') {
          dateClause = 'DURING LAST_30_DAYS';
        } else if (p === 'this_month' || p === 'month') {
          dateClause = 'DURING THIS_MONTH';
        } else if (p === 'maximum' || p === 'all' || p === 'all_time') {
          dateClause = '';
        }

        const whereClause = dateClause ? `WHERE segments.date ${dateClause}` : '';
        const query = `
          SELECT 
            metrics.cost_micros, 
            metrics.impressions, 
            metrics.clicks, 
            metrics.ctr, 
            metrics.conversions 
          FROM customer 
          ${whereClause}
        `;

        const res = await customer.query(query);
        if (res && res.length > 0 && res[0].metrics) {
          const m: any = res[0].metrics;
          const costMicros = Number(m.cost_micros ?? 0);
          const spendAed = parseFloat(((costMicros / 1000000) * 3.67).toFixed(2));
          const impressions = Number(m.impressions ?? 0);
          const clicks = Number(m.clicks ?? 0);
          const conversions = Math.round(Number(m.conversions ?? 0));
          const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;
          const cplAed = conversions > 0 ? parseFloat((spendAed / conversions).toFixed(2)) : (clicks > 0 ? parseFloat((spendAed / clicks).toFixed(2)) : 0);

          return {
            spendAed,
            impressions,
            clicks,
            ctr,
            leads: conversions,
            cplAed,
            isLive: true,
          };
        }
      } catch (error: any) {
        console.error('Error querying live Google Ads API:', error);
        return {
          spendAed: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          leads: 0,
          cplAed: 0,
          isLive: false,
          errorMessage: error?.message || String(error),
        };
      }
    }

    return {
      spendAed: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      leads: 0,
      cplAed: 0,
      isLive: false,
      errorMessage: 'Missing Google Ads API environment variables',
    };
  }
}

export const googleAdsService = GoogleAdsService.getInstance();
