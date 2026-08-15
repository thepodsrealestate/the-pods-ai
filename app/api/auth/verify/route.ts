import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('pods_session')?.value;

  if (sessionToken === 'authenticated_minesh_pods_session_token_2026') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
