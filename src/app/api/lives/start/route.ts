import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/lives/start — Start a new live stream
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artistId, title, description } = body;

    if (!artistId || !title) {
      return NextResponse.json({ error: 'artistId and title are required' }, { status: 400 });
    }

    // Check if artist already has an active live stream
    const existingLive = await db.liveStream.findFirst({
      where: { artistId, isLive: true },
    });

    if (existingLive) {
      return NextResponse.json(
        { error: 'You already have an active live stream. End it first.', liveId: existingLive.id },
        { status: 400 }
      );
    }

    // Verify artist exists
    const artist = await db.artist.findUnique({ where: { id: artistId } });
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const liveStream = await db.liveStream.create({
      data: {
        artistId,
        title,
        description: description || null,
        isLive: true,
        isScheduled: false,
        startedAt: new Date(),
        viewerCount: 0,
        maxViewers: 0,
        streamUrl: `/live/${artistId}`,
      },
    });

    return NextResponse.json({ liveStream }, { status: 201 });
  } catch (error) {
    console.error('[LIVES_START_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
