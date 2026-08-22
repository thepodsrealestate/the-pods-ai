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
   * Generates a signed Google OAuth2 Access Token using RS256 Service Account JWT
   */
  private static async getAccessToken(): Promise<string | null> {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'pods-calendar-bot@graphic-transit-506308-k5.iam.gserviceaccount.com';
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!privateKey) {
      console.warn('[GCAL] GOOGLE_PRIVATE_KEY not set in environment variables');
      return null;
    }

    // Handle escaped newlines in .env
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Check cache
    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60) {
      return this.cachedToken.token;
    }

    try {
      const header = { alg: 'RS256', typ: 'JWT' };
      const claimSet = {
        iss: clientEmail,
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

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
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
