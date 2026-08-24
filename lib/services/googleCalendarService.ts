import crypto from 'crypto';

interface CalendarEventParams {
  summary: string;
  description: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  attendeeEmail?: string;
  attendeeName?: string;
}

export class GoogleCalendarService {
  private static cachedToken: { token: string; expiresAt: number } | null = null;

  /**
   * Generates a Google Access Token using either:
   * 1. Direct User OAuth 2.0 Refresh Token (Owner permissions, no Workspace Admin required)
   * 2. Service Account RS256 JWT
   */
  private static async getAccessToken(): Promise<string | null> {
    // Check cache
    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60) {
      return this.cachedToken.token;
    }

    // Method 1: OAuth2 User Refresh Token (Bypasses Workspace Admin restrictions)
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

    if (refreshToken && clientId && clientSecret && !clientId.includes('placeholder')) {
      try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          this.cachedToken = {
            token: tokenData.access_token,
            expiresAt: now + (tokenData.expires_in || 3600),
          };
          return this.cachedToken.token;
        }
      } catch (oauthErr: any) {
        console.warn('[GCAL] OAuth refresh token error, falling back to service account:', oauthErr.message);
      }
    }

    // Method 2: Service Account RS256 JWT
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'pods-calendar-bot@graphic-transit-506308-k5.iam.gserviceaccount.com';
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!privateKey) {
      console.warn('[GCAL] Neither GOOGLE_REFRESH_TOKEN nor GOOGLE_PRIVATE_KEY is set');
      return null;
    }

    // Handle escaped newlines and outer quotes in .env / Vercel
    privateKey = privateKey
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n');

    try {
      const targetUser = process.env.GOOGLE_CALENDAR_TARGET_USER || 'info@thepodsrealestate.ae';
      const header = { alg: 'RS256', typ: 'JWT' };
      const claimSet: any = {
        iss: clientEmail,
        sub: targetUser,
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
      };

      const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
      const base64Claim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
      const signInput = `${base64Header}.${base64Claim}`;

      const signer = crypto.createSign('RSA-SHA256');
      signer.update(signInput);
      signer.end();
      const signature = signer.sign(privateKey, 'base64url');
      const jwt = `${signInput}.${signature}`;

      let tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      let tokenData = await tokenRes.json();
      
      // Fallback: If target user fails, try minesh@thepods.ae
      if (!tokenRes.ok && targetUser !== 'minesh@thepods.ae') {
        const fallbackClaimSet = { ...claimSet, sub: 'minesh@thepods.ae' };
        const fbClaim = Buffer.from(JSON.stringify(fallbackClaimSet)).toString('base64url');
        const fbSignInput = `${base64Header}.${fbClaim}`;
        const fbSigner = crypto.createSign('RSA-SHA256');
        fbSigner.update(fbSignInput);
        fbSigner.end();
        const fbJwt = `${fbSignInput}.${fbSigner.sign(privateKey, 'base64url')}`;
        
        const fbRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: fbJwt,
          }),
        });
        const fbData = await fbRes.json();
        if (fbRes.ok && fbData.access_token) {
          tokenData = fbData;
        }
      }

      if (!tokenData.access_token) {
        console.error('[GCAL] Failed to obtain OAuth token:', tokenData);
        return null;
      }

      this.cachedToken = {
        token: tokenData.access_token,
        expiresAt: now + (tokenData.expires_in || 3600),
      };

      return this.cachedToken.token;
    } catch (err: any) {
      console.error('[GCAL] Error generating Google access token:', err.message);
      return null;
    }
  }

  /**
   * Inserts an event directly into Minesh Patel's Google Calendar
   */
  static async insertEvent(params: CalendarEventParams): Promise<{ eventId?: string; htmlLink?: string; meetLink?: string } | null> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        console.warn('[GCAL] Skipping Google Calendar API call (No access token available)');
        return null;
      }

      const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || 'primary');
      const startDateTime = params.startTime.toISOString();
      const endDateTime = (params.endTime || new Date(params.startTime.getTime() + 45 * 60 * 1000)).toISOString();

      const attendees: { email: string; displayName?: string }[] = [
        { email: 'info@thepodsrealestate.ae', displayName: 'Minesh Patel (The Pods)' },
      ];
      if (params.attendeeEmail && params.attendeeEmail !== 'info@thepodsrealestate.ae') {
        attendees.push({ email: params.attendeeEmail, displayName: params.attendeeName || undefined });
      }

      const eventPayload: any = {
        summary: params.summary,
        description: params.description,
        location: params.location,
        start: { dateTime: startDateTime, timeZone: 'Asia/Dubai' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Dubai' },
        attendees,
        conferenceData: {
          createRequest: {
            requestId: `meet_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('[GCAL] Calendar API error response:', data);
        return null;
      }

      const meetLink = data.hangoutLink || data.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri;
      console.log('[GCAL] Event created successfully with Google Meet:', data.id, meetLink);
      return { eventId: data.id, htmlLink: data.htmlLink, meetLink };
    } catch (err: any) {
      console.error('[GCAL] Failed to insert event:', err.message);
      return null;
    }
  }
}
