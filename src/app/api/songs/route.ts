import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/songs - List songs with pagination, filtering by genre, search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const genre = searchParams.get('genre') || undefined;
    const search = searchParams.get('search') || undefined;
    const artistId = searchParams.get('artistId') || undefined;
    const albumId = searchParams.get('albumId') || undefined;
    const status = searchParams.get('status') || 'approved';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      status,
    };

    if (genre) {
      where.genre = genre;
    }

    if (artistId) {
      where.artistId = artistId;
    }

    if (albumId) {
      where.albumId = albumId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { genre: { contains: search } },
        { artist: { stageName: { contains: search } } },
      ];
    }

    // Build orderBy
    const validSortFields = ['createdAt', 'playCount', 'likeCount', 'title', 'releaseDate'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [songs, total] = await Promise.all([
      db.song.findMany({
        where,
        include: {
          artist: {
            select: {
              id: true,
              stageName: true,
              avatar: true,
              verified: true,
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
            },
          },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limit,
      }),
      db.song.count({ where }),
    ]);

    return NextResponse.json({
      songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[SONGS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/songs - Create new song (creator only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      artistId,
      albumId,
      duration,
      audioUrl,
      coverUrl,
      lyrics,
      syncedLyrics,
      genre,
      mood,
      isrc,
      isExplicit,
      releaseDate,
    } = body;

    // Validate required fields
    if (!title || !artistId || !audioUrl) {
      return NextResponse.json(
        { error: 'Title, artistId, and audioUrl are required' },
        { status: 400 }
      );
    }

    // Verify the artist exists and belongs to a creator user
    const artist = await db.artist.findUnique({
      where: { id: artistId },
      include: { user: true },
    });

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    if (artist.user.role !== 'creator' && artist.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only creator accounts can upload songs' },
        { status: 403 }
      );
    }

    // Create the song
    const song = await db.song.create({
      data: {
        title,
        artistId,
        albumId: albumId || null,
        duration: duration || 0,
        audioUrl,
        coverUrl: coverUrl || null,
        lyrics: lyrics || null,
        syncedLyrics: syncedLyrics || null,
        genre: genre || null,
        mood: mood || null,
        isrc: isrc || null,
        isExplicit: isExplicit || false,
        status: 'pending',
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
            verified: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Song created successfully. Pending approval.',
        song,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SONGS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
