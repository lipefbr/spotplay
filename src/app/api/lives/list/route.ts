import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lives/list — Get live streams for an artist
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');

    if (!artistId) {
      return NextResponse.json({ error: 'artistId is required' }, { status: 400 });
    }

    const liveStreams = await db.liveStream.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const activeLive = liveStreams.find(l => l.isLive);

    return NextResponse.json({ liveStreams, activeLive: activeLive || null });
  } catch (error) {
    console.error('[LIVES_LIST_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
