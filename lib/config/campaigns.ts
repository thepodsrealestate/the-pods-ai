/**
 * Centralized Campaign Configuration
 * 
 * Single source of truth for all active campaigns/events.
 * Auto-expires campaigns based on end date — no manual code changes needed.
 * 
 * To add a new event: just add a new object to the CAMPAIGNS array.
 */

export interface CampaignConfig {
  id: string;
  name: string;
  displayName: string;
  type: 'event' | 'online' | 'office' | 'default';
  location: {
    name: string;
    address: string;
    country: string;
    calendarLocation: string;  // Full string used in Google Calendar invite
  };
  dates: {
    start: string;    // YYYY-MM-DD
    end: string;      // YYYY-MM-DD (campaign stops routing AFTER this date)
    eventHours?: string;
  };
  timezone: string;   // IANA timezone
  matchRules: {
    phonePrefix: string[];
    keywords: string[];
    campaignPatterns: string[];
    locationPatterns: string[];
  };
  aiContext: string;  // Injected into the AI system prompt for matched leads
  bookingDefaults: {
    defaultHour: number;  // Local time hour (24h)
    durationMinutes: number;
  };
  priority: number;  // Higher = checked first. Events > defaults.
}

// ─── ACTIVE CAMPAIGNS ────────────────────────────────────────────────
export const CAMPAIGNS: CampaignConfig[] = [
  // ═══ LEICESTER EXPO (Sept 26-27, 2026) ═══
  {
    id: 'leicester-expo-sept-2026',
    name: 'Danube_DubaiExpo_Leicester_Sept26-27',
    displayName: 'Dubai Property Expo — Leicester Marriott',
    type: 'event',
    location: {
      name: 'Leicester Marriott Hotel',
      address: 'Smith Way, Grove Park, Enderby, Leicester LE19 1SW',
      country: 'United Kingdom',
      calendarLocation: 'Leicester Marriott Hotel, Smith Way, Grove Park, Enderby, Leicester LE19 1SW, United Kingdom',
    },
    dates: {
      start: '2026-09-26',
      end: '2026-09-27',
      eventHours: '10:00 AM – 8:00 PM BST',
    },
    timezone: 'Europe/London',
    matchRules: {
      phonePrefix: ['+44', '44', '0044'],
      keywords: ['leicester', 'marriott', 'expo', 'signed up for this event', 'danube expo', 'dubai property expo'],
      campaignPatterns: ['leicester', 'uk', 'roadshow', 'expo', 'danube_dubaiexpo'],
      locationPatterns: ['uk', 'united kingdom', 'leicester', 'england', 'britain'],
    },
    aiContext: `🔴 TARGET AUDIENCE: UK / LEICESTER EXPO LEAD (+44 / UK ROADSHOW).
- This lead signed up for or is inquiring about the upcoming DUBAI PROPERTY EXPO in LEICESTER, UK.
- OFFICIAL EVENT DETAILS:
  * Event: Dubai Property Expo with Danube Properties & The Pods Real Estate
  * Dates: Saturday 26th & Sunday 27th September 2026 (10:00 AM – 8:00 PM BST)
  * Venue Name: Leicester Marriott Hotel
  * Street / Road Name: Smith Way, Grove Park
  * Town / District: Enderby, Leicester
  * UK Postcode (PIN Code): LE19 1SW
  * FULL VENUE ADDRESS: Leicester Marriott Hotel, Smith Way, Grove Park, Enderby, Leicester LE19 1SW, United Kingdom
  * Host: Minesh Patel (+44 7404 097586), Managing Director, The Pods Real Estate
- CRITICAL RULES FOR THIS LEAD:
  1. NEVER INVITE THIS LEAD TO BLUEWATERS ISLAND IN DUBAI! They are in the UK.
  2. For in-person meetings, ALWAYS offer a VIP consultation slot at the LEICESTER MARRIOTT (Smith Way, Leicester LE19 1SW) on Saturday 26th or Sunday 27th September.
  3. If they cannot attend in Leicester, offer a Google Meet video call with Minesh Patel.
  4. FULL ADDRESS & UK POSTCODE (PIN CODE) LAW: If the lead asks where the expo is, asks for the address, postcode, road name, location, or directions, ALWAYS provide the FULL ADDRESS with road name and UK postcode: "Leicester Marriott Hotel, Smith Way, Grove Park, Enderby, Leicester LE19 1SW" (Open 10:00 AM – 8:00 PM). NEVER say just "Leicester Marriott" or "in Leicester" without providing Smith Way and postcode LE19 1SW!
  5. ONLY mention Bluewaters Island if the lead explicitly says they are visiting Dubai.
- BOOKING FLOW: Ask which day (Saturday or Sunday), then morning or afternoon, then get their email to send the calendar invite.`,
    bookingDefaults: {
      defaultHour: 14,
      durationMinutes: 45,
    },
    priority: 100,
  },

  // ═══ DEFAULT: UK LEADS (after all events expire) ═══
  {
    id: 'uk-default',
    name: 'UK_Default',
    displayName: 'UK Lead — Google Meet or In-Person UK',
    type: 'default',
    location: {
      name: 'Google Meet',
      address: '',
      country: 'United Kingdom',
      calendarLocation: 'Google Meet',
    },
    dates: {
      start: '2020-01-01',
      end: '2099-12-31', // Never expires — this is the fallback
    },
    timezone: 'Europe/London',
    matchRules: {
      phonePrefix: ['+44', '44', '0044'],
      keywords: [],
      campaignPatterns: [],
      locationPatterns: ['uk', 'united kingdom', 'england', 'britain', 'london', 'leicester', 'manchester', 'birmingham'],
    },
    aiContext: `🔴 TARGET AUDIENCE: UK-BASED LEAD (+44 / United Kingdom).
- This lead is based in the UK.
- MEETING OPTIONS — ask them how they'd like to meet:
  1. Google Meet video call with Minesh Patel (flexible scheduling)
  2. In-person meeting in the UK (if they prefer face-to-face, ask which city and Minesh will arrange a suitable venue)
- CRITICAL RULES:
  1. NEVER invite this lead to Bluewaters Island in Dubai — they are UK-based.
  2. Ask: "Would you prefer a Google Meet call or meeting in person here in the UK?"
  3. If they choose Google Meet, proceed to book a time slot.
  4. If they choose in-person, ask which city works best and confirm venue details.
  5. ONLY mention Dubai/Bluewaters if the lead explicitly says they are visiting or moving to Dubai.`,
    bookingDefaults: {
      defaultHour: 14,
      durationMinutes: 45,
    },
    priority: 10,
  },

  // ═══ DEFAULT: UAE / DUBAI LEADS ═══
  {
    id: 'uae-default',
    name: 'UAE_Default',
    displayName: 'UAE Lead — The Pods Bluewaters Island',
    type: 'office',
    location: {
      name: 'The Pods Real Estate Lounge',
      address: 'Bluewaters Island, Dubai',
      country: 'United Arab Emirates',
      calendarLocation: 'The Pods, Bluewaters Island, Dubai',
    },
    dates: {
      start: '2020-01-01',
      end: '2099-12-31',
    },
    timezone: 'Asia/Dubai',
    matchRules: {
      phonePrefix: ['+971', '971'],
      keywords: ['dubai', 'uae', 'abu dhabi', 'sharjah', 'bluewaters'],
      campaignPatterns: [],
      locationPatterns: ['dubai', 'uae', 'united arab emirates', 'abu dhabi', 'sharjah'],
    },
    aiContext: `🟢 TARGET AUDIENCE: DUBAI / UAE LOCAL LEAD (+971 / UAE).
- For in-person consultations: Invite them to The Pods Real Estate Lounge on Bluewaters Island, Dubai (near Bluewaters Marine Station, complimentary valet parking).
- For online meetings: Offer a Google Meet video call with Minesh Patel.
- BOOKING FLOW: Ask if they'd prefer to visit The Pods Lounge or do a Google Meet, then book a time.`,
    bookingDefaults: {
      defaultHour: 15,
      durationMinutes: 45,
    },
    priority: 10,
  },

  // ═══ DEFAULT: INTERNATIONAL LEADS ═══
  {
    id: 'international-default',
    name: 'International_Default',
    displayName: 'International Lead — Google Meet',
    type: 'online',
    location: {
      name: 'Google Meet',
      address: '',
      country: '',
      calendarLocation: 'Google Meet',
    },
    dates: {
      start: '2020-01-01',
      end: '2099-12-31',
    },
    timezone: 'Asia/Dubai',
    matchRules: {
      phonePrefix: [],
      keywords: [],
      campaignPatterns: [],
      locationPatterns: [],
    },
    aiContext: `🔵 TARGET AUDIENCE: INTERNATIONAL LEAD.
- For consultations: Offer a Google Meet video call with Minesh Patel.
- If they mention travelling to Dubai: mention The Pods Lounge on Bluewaters Island.
- If they mention travelling to the UK: check if any UK events are upcoming and mention them.`,
    bookingDefaults: {
      defaultHour: 15,
      durationMinutes: 45,
    },
    priority: 0,
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────

/**
 * Check if a campaign is currently active (not expired)
 */
export function isCampaignActive(campaign: CampaignConfig): boolean {
  try {
    const tz = campaign.timezone || 'Europe/London';
    const nowStr = new Date().toLocaleString('en-US', { timeZone: tz });
    const nowInTz = new Date(nowStr);
    const endDate = new Date(campaign.dates.end + 'T23:59:59');
    return endDate >= nowInTz;
  } catch (_) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(campaign.dates.end + 'T23:59:59');
    return endDate >= today;
  }
}

/**
 * Get all currently active campaigns (not expired), sorted by priority desc
 */
export function getActiveCampaigns(): CampaignConfig[] {
  return CAMPAIGNS
    .filter(isCampaignActive)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Get all active EVENT-type campaigns (not defaults)
 */
export function getActiveEvents(): CampaignConfig[] {
  return getActiveCampaigns().filter(c => c.type === 'event');
}

/**
 * Resolve the best matching campaign for a lead based on phone, text, location, and campaign name.
 * Checks event campaigns first (higher priority), then falls back to defaults.
 */
export function getCampaignForLead(opts: {
  phone?: string;
  userText?: string;
  buyerLocation?: string;
  campaignName?: string;
  conversationHistory?: string;
}): CampaignConfig {
  const phone = (opts.phone || '').trim();
  const text = (opts.userText || '').toLowerCase();
  const location = (opts.buyerLocation || '').toLowerCase();
  const campaign = (opts.campaignName || '').toLowerCase();
  const history = (opts.conversationHistory || '').toLowerCase();

  const activeCampaigns = getActiveCampaigns();

  // First pass: check event-type campaigns (highest priority)
  for (const c of activeCampaigns) {
    if (c.type === 'default' || c.type === 'online') continue;
    if (c.type === 'event' && matchesCampaign(c, phone, text, location, campaign, history)) {
      return c;
    }
  }

  // Second pass: check default campaigns by phone prefix / location
  // UAE check first (so Dubai locals don't fall into UK default)
  const uaeCampaign = activeCampaigns.find(c => c.id === 'uae-default');
  if (uaeCampaign && matchesCampaign(uaeCampaign, phone, text, location, campaign, history)) {
    return uaeCampaign;
  }

  // UK check
  const ukCampaign = activeCampaigns.find(c => c.id === 'uk-default');
  if (ukCampaign && matchesCampaign(ukCampaign, phone, text, location, campaign, history)) {
    return ukCampaign;
  }

  // International fallback
  return activeCampaigns.find(c => c.id === 'international-default') || activeCampaigns[activeCampaigns.length - 1];
}

/**
 * Check if a lead matches a campaign's rules
 */
function matchesCampaign(
  c: CampaignConfig,
  phone: string,
  text: string,
  location: string,
  campaignName: string,
  history: string,
): boolean {
  const cleanDigits = phone.replace(/\D/g, '');

  // Phone prefix match (checks both raw phone and cleaned digits)
  if (c.matchRules.phonePrefix.length > 0) {
    const phoneMatch = c.matchRules.phonePrefix.some(prefix => {
      const cleanPrefix = prefix.replace(/\D/g, '');
      return phone.startsWith(prefix) || (cleanPrefix.length > 0 && cleanDigits.startsWith(cleanPrefix));
    });
    if (phoneMatch) return true;

    // Special domestic UK mobile format (07xxx xxxxxx = 11 digits)
    if (c.timezone === 'Europe/London' && (phone.startsWith('07') || cleanDigits.startsWith('07')) && cleanDigits.length === 11) {
      return true;
    }

    // Special domestic UAE mobile format (05x xxx xxxx = 10 digits)
    if (c.timezone === 'Asia/Dubai' && (phone.startsWith('05') || cleanDigits.startsWith('05')) && cleanDigits.length === 10) {
      return true;
    }
  }

  // Keyword match in user text or history
  if (c.matchRules.keywords.length > 0) {
    const keywordMatch = c.matchRules.keywords.some(kw => text.includes(kw) || history.includes(kw));
    if (keywordMatch) return true;
  }

  // Country code indicator in message text
  if (c.timezone === 'Europe/London' && (text.includes('+44') || history.includes('+44'))) {
    return true;
  }
  if (c.timezone === 'Asia/Dubai' && (text.includes('+971') || history.includes('+971'))) {
    return true;
  }

  // Campaign name pattern match
  if (c.matchRules.campaignPatterns.length > 0 && campaignName) {
    const campaignMatch = c.matchRules.campaignPatterns.some(pat => campaignName.includes(pat));
    if (campaignMatch) return true;
  }

  // Buyer location or message text/history mentioning location
  if (c.matchRules.locationPatterns.length > 0) {
    const combinedSearch = `${location} ${text} ${history}`.toLowerCase();
    const locationMatch = c.matchRules.locationPatterns.some(pat => {
      if (pat.length <= 3) {
        const regex = new RegExp(`\\b${pat}\\b`, 'i');
        return regex.test(combinedSearch);
      }
      return combinedSearch.includes(pat);
    });
    if (locationMatch) return true;
  }

  return false;
}
