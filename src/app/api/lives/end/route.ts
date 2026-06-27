import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/lives/end — End an active live stream
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { liveId } = body;

    if (!liveId) {
      return NextResponse.json({ error: 'liveId is required' }, { status: 400 });
    }

    const liveStream = await db.liveStream.findUnique({ where: { id: liveId } });

    if (!liveStream) {
      return NextResponse.json({ error: 'Live stream not found' }, { status: 404 });
    }

    if (!liveStream.isLive) {
      return NextResponse.json({ error: 'Live stream is not active' }, { status: 400 });
    }

    const updatedLive = await db.liveStream.update({
      where: { id: liveId },
      data: {
        isLive: false,
        endedAt: new Date(),
      },
    });

    return NextResponse.json({ liveStream: updatedLive });
  } catch (error) {
    console.error('[LIVES_END_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
