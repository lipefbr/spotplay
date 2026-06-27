import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/lives/active — Get all currently active live streams
export async function GET() {
  try {
    const activeLives = await db.liveStream.findMany({
      where: { isLive: true },
      orderBy: { viewerCount: 'desc' },
      include: {
        artist: {
          select: { stageName: true, avatar: true },
        },
      },
    });

    const scheduledLives = await db.liveStream.findMany({
      where: { isScheduled: true, isLive: false },
      orderBy: { scheduledAt: 'asc' },
      include: {
        artist: {
          select: { stageName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ activeLives, scheduledLives });
  } catch (error) {
    console.error('[LIVES_ACTIVE_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
