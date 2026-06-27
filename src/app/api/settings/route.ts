import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clearAsaasConfigCache } from '@/lib/asaas';

// GET /api/settings — Get all platform settings (admin only)
export async function GET() {
  try {
    const configs = await db.platformConfig.findMany();
    const settings: Record<string, string> = {};
    for (const c of configs) {
      settings[c.key] = c.value;
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/settings — Save platform settings (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: Record<string, string> };

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'settings object is required' }, { status: 400 });
    }

    // Upsert each setting
    const upserts = Object.entries(settings).map(([key, value]) =>
      db.platformConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await Promise.all(upserts);

    // Clear Asaas config cache so new values are picked up
    clearAsaasConfigCache();

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('[SETTINGS_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
