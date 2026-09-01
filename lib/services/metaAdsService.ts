export interface MetaAdsMetrics {
  spendAed: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cplAed: number;
  cpcAed: number;
  isLive: boolean;
  errorMessage?: string;
}

export class MetaAdsService {
  private static instance: MetaAdsService;

  private constructor() {}

  public static getInstance(): MetaAdsService {
    if (!MetaAdsService.instance) {
      MetaAdsService.instance = new MetaAdsService();
    }
    return MetaAdsService.instance;
  }

  public async getMetrics(period: string = 'last_30d'): Promise<MetaAdsMetrics> {
    const accessToken = process.env.META_ADS_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    // If live credentials are available, fetch from Meta Graph API
    if (accessToken && adAccountId) {
      try {
        const cleanAccount = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
        const effectivePreset = period === 'last_30d' ? 'maximum' : period;
        let url = `https://graph.facebook.com/v19.0/${cleanAccount}/insights?fields=spend,impressions,clicks,ctr,actions&date_preset=${encodeURIComponent(effectivePreset)}&access_token=${accessToken}`;
        
        let res = await fetch(url, { cache: 'no-store' });
        let json = res.ok ? await res.json() : null;

        // Fallback to maximum date preset if specific preset is empty
        if ((!json || !json.data || json.data.length === 0) && effectivePreset !== 'maximum') {
          url = `https://graph.facebook.com/v19.0/${cleanAccount}/insights?fields=spend,impressions,clicks,ctr,actions&date_preset=maximum&access_token=${accessToken}`;
          res = await fetch(url, { cache: 'no-store' });
          if (res.ok) json = await res.json();
        }

        if (json && json.data && json.data.length > 0) {
          const data = json.data[0];
          const spend = parseFloat(data.spend || '0');
          const impressions = parseInt(data.impressions || '0', 10);
          const clicks = parseInt(data.clicks || '0', 10);
          const ctr = parseFloat((parseFloat(data.ctr || '0')).toFixed(2));
          
          // Extract leads action if present
          let leads = 0;
          if (Array.isArray(data.actions)) {
            const leadAction = data.actions.find((a: any) => 
              a.action_type === 'lead' || 
              a.action_type === 'onsite_conversion.lead_grouped' ||
              a.action_type === 'offsite_complete_registration_add_meta_leads'
            );
            if (leadAction) {
              leads = parseInt(leadAction.value || '0', 10);
            }
          }

          const cplAed = leads > 0 ? parseFloat((spend / leads).toFixed(2)) : 0;
          const cpcAed = clicks > 0 ? parseFloat((spend / clicks).toFixed(2)) : 0;

          return {
            spendAed: parseFloat(spend.toFixed(2)),
            impressions,
            clicks,
            ctr,
            leads,
            cplAed,
            cpcAed,
            isLive: true,
          };
        }
      } catch (error: any) {
        console.error('Error fetching live Meta Ads metrics:', error);
        return {
          spendAed: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          leads: 0,
          cplAed: 0,
          cpcAed: 0,
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
      cpcAed: 0,
      isLive: false,
      errorMessage: 'Missing Meta Ads API environment variables',
    };
  }
  public async getCampaigns(period: string = 'last_30d'): Promise<any[]> {
    const accessToken = process.env.META_ADS_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    if (!accessToken || !adAccountId) return [];
    try {
      const cleanAccount = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
      const effectivePreset = period === 'last_30d' ? 'maximum' : period;
      
      // 1. Fetch insights metrics
      const insightsUrl = `https://graph.facebook.com/v19.0/${cleanAccount}/insights?fields=campaign_name,campaign_id,spend,impressions,clicks,ctr,actions&level=campaign&date_preset=${encodeURIComponent(effectivePreset)}&limit=50&access_token=${accessToken}`;
      // 2. Fetch active campaign metadata
      const rawCampaignsUrl = `https://graph.facebook.com/v19.0/${cleanAccount}/campaigns?fields=id,name,status,effective_status&effective_status=['ACTIVE']&limit=50&access_token=${accessToken}`;

      const [insightsRes, campaignsRes] = await Promise.all([
        fetch(insightsUrl, { cache: 'no-store' }),
        fetch(rawCampaignsUrl, { cache: 'no-store' }).catch(() => null),
      ]);

      const insightsJson = insightsRes.ok ? await insightsRes.json() : { data: [] };
      const campaignsJson = campaignsRes && campaignsRes.ok ? await campaignsRes.json() : { data: [] };

      const campaignMap = new Map<string, any>();

      if (Array.isArray(insightsJson?.data)) {
        insightsJson.data.forEach((d: any) => {
          const spend = parseFloat(d.spend || '0');
          const clicks = parseInt(d.clicks || '0', 10);
          const impressions = parseInt(d.impressions || '0', 10);
          let leads = 0;
          if (Array.isArray(d.actions)) {
            const la = d.actions.find((a: any) => a.action_type === 'lead' || a.action_type === 'onsite_conversion.lead_grouped');
            if (la) leads = parseInt(la.value || '0', 10);
          }
          campaignMap.set(d.campaign_id, {
            platform: 'meta',
            campaignName: d.campaign_name,
            campaignId: d.campaign_id,
            spend: parseFloat(spend.toFixed(2)),
            clicks,
            impressions,
            ctr: parseFloat((parseFloat(d.ctr || '0')).toFixed(2)),
            leads,
            cpc: clicks > 0 ? parseFloat((spend / clicks).toFixed(2)) : 0,
            cpl: leads > 0 ? parseFloat((spend / leads).toFixed(2)) : 0,
          });
        });
      }

      // Merge any newly published ACTIVE campaigns that haven't generated insights yet
      if (Array.isArray(campaignsJson?.data)) {
        campaignsJson.data.forEach((c: any) => {
          if (!campaignMap.has(c.id)) {
            campaignMap.set(c.id, {
              platform: 'meta',
              campaignName: c.name,
              campaignId: c.id,
              spend: 0,
              clicks: 0,
              impressions: 0,
              ctr: 0,
              leads: 0,
              cpc: 0,
              cpl: 0,
            });
          }
        });
      }

      return Array.from(campaignMap.values());
    } catch { return []; }
  }
}

export const metaAdsService = MetaAdsService.getInstance();
