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

  public async getMetrics(): Promise<GoogleAdsMetrics> {
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

    // If live credentials are set up, fetch from Google Ads API
    if (developerToken && customerId) {
      try {
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
              Authorization: `Bearer ${process.env.GOOGLE_ADS_ACCESS_TOKEN || ''}`,
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

    // Return zero when credentials are not configured
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
