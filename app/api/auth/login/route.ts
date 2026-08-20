import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const validPassword = process.env.DASHBOARD_PASSCODE || process.env.NEXT_PUBLIC_DASHBOARD_PASSCODE || 'MineshPods0070';
    const validEmail = process.env.DASHBOARD_EMAIL || process.env.NEXT_PUBLIC_DASHBOARD_EMAIL || 'info@thepodsrealestate.ae';

    if (
      email?.toLowerCase().trim() === validEmail.toLowerCase().trim() &&
      password === validPassword
    ) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

      const sessionSecret = process.env.DASHBOARD_SESSION_SECRET || 'authenticated_minesh_pods_session_token_2026';

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
