export interface GoogleAdsMetrics {
  spendAed: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cplAed: number;
  isLive: boolean;
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

  private async getAccessToken(): Promise<string | null> {
    if (process.env.GOOGLE_ADS_ACCESS_TOKEN && !process.env.GOOGLE_ADS_ACCESS_TOKEN.includes('placeholder')) {
      return process.env.GOOGLE_ADS_ACCESS_TOKEN;
    }

    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

    if (refreshToken && clientId && clientSecret) {
      try {
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        });
        const data = await res.json();
        if (data.access_token) return data.access_token;
        console.error('[GOOGLE ADS] Token response failed:', data);
      } catch (err: any) {
        console.error('[GOOGLE ADS] Token exchange error:', err?.message || err);
      }
    }
    return null;
  }

  public async getMetrics(period: string = 'last_30d'): Promise<GoogleAdsMetrics> {
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

    // If live credentials are set up, fetch from Google Ads API
    if (developerToken && customerId) {
      try {
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
          console.warn('[GOOGLE ADS] No access token available yet');
          return this.getFallbackMetrics();
        }

        const cleanCustomerId = customerId.replace(/-/g, '');
        const query = `
          SELECT 
            metrics.cost_micros, 
            metrics.impressions, 
            metrics.clicks, 
            metrics.ctr, 
            metrics.conversions 
          FROM customer 
          WHERE segments.date DURING THIS_MONTH
        `;

        const res = await fetch(
          `https://googleads.googleapis.com/v17/customers/${cleanCustomerId}/googleAds:searchStream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'developer-token': developerToken,
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ query }),
            cache: 'no-store',
          }
        );

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0 && json[0].results) {
            const metrics = json[0].results[0].metrics;
            const spend = (parseFloat(metrics.cost_micros || '0') / 1000000) * 3.67;
            const impressions = parseInt(metrics.impressions || '0', 10);
            const clicks = parseInt(metrics.clicks || '0', 10);
            const ctr = parseFloat((parseFloat(metrics.ctr || '0') * 100).toFixed(2));
            const leads = Math.round(parseFloat(metrics.conversions || '0'));
            const cplAed = leads > 0 ? parseFloat((spend / leads).toFixed(2)) : 0;

            return {
              spendAed: Math.round(spend),
              impressions,
              clicks,
              ctr,
              leads,
              cplAed,
              isLive: true,
            };
          }
        }
      } catch (error) {
        console.error('Error fetching live Google Ads metrics:', error);
      }
    }

    return this.getFallbackMetrics();
  }

  private getFallbackMetrics(): GoogleAdsMetrics {
    return {
      spendAed: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      leads: 0,
      cplAed: 0,
      isLive: false,
    };
  }
}

export const googleAdsService = GoogleAdsService.getInstance();
