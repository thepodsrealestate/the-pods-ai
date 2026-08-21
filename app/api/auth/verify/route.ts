import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('pods_session')?.value || req.cookies.get('the_pods_session')?.value;
  const sessionSecret = process.env.DASHBOARD_SESSION_SECRET || 'authenticated_minesh_pods_session_token_2026';

  if (sessionToken === sessionSecret) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
