import { NextRequest, NextResponse } from 'next/server';
import { SystemConfigService, SystemAiMode } from '@/lib/services/systemConfigService';

export async function GET() {
  try {
    const mode = await SystemConfigService.getGlobalAiMode();
    return NextResponse.json({
      status: 'success',
      mode,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message, mode: 'DAY' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body.mode as SystemAiMode;

    if (mode !== 'DAY' && mode !== 'NIGHT') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid mode. Must be DAY or NIGHT.' },
        { status: 400 }
      );
    }

    await SystemConfigService.setGlobalAiMode(mode);

    return NextResponse.json({
      status: 'success',
      mode,
      message: `Global AI mode updated to ${mode}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
