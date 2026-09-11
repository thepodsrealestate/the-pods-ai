import { NextRequest, NextResponse } from 'next/server';

// Brute-force protection: IP -> failed attempt timestamps
const loginAttempts = new Map<string, number[]>();

function isRateLimited(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const attempts = (loginAttempts.get(ip) || []).filter(ts => now - ts < windowMs);
  loginAttempts.set(ip, attempts);
  return attempts.length >= maxAttempts;
}

function recordFailedAttempt(ip: string) {
  const attempts = loginAttempts.get(ip) || [];
  attempts.push(Date.now());
  loginAttempts.set(ip, attempts);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';

    // Rate-limit check: lock out after 5 consecutive failures
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    // Secure server-only environment variables (never exposed in client JS)
    const validPassword = process.env.DASHBOARD_PASSCODE || 'MineshPods0070';
    const validEmail = process.env.DASHBOARD_EMAIL || 'info@thepodsrealestate.ae';

    if (
      email?.toLowerCase().trim() === validEmail.toLowerCase().trim() &&
      password === validPassword
    ) {
      clearAttempts(clientIp);

      const sessionSecret = process.env.DASHBOARD_SESSION_SECRET;

      if (!sessionSecret) {
        console.error('[AUTH] DASHBOARD_SESSION_SECRET not configured');
        return NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 });
      }

      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

      // Set encrypted HttpOnly cookie
      response.cookies.set('pods_session', sessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    recordFailedAttempt(clientIp);

    return NextResponse.json(
      { success: false, message: 'Invalid email address or passcode' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
