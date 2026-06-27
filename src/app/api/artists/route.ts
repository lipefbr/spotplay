import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/artists - List/search artists
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const genre = searchParams.get('genre') || undefined;
    const country = searchParams.get('country') || undefined;
    const verified = searchParams.get('verified') || undefined;
    const sortBy = searchParams.get('sortBy') || 'monthlyListeners';
    const order = searchParams.get('order') || 'desc';
    const email = searchParams.get('email') || undefined;
    const userId = searchParams.get('userId') || undefined;

    // If email or userId is provided, look up a specific artist
    if (email || userId) {
      const userWhere = email ? { email } : { id: userId };
      const user = await db.user.findUnique({ where: userWhere });
      if (!user) {
        return NextResponse.json({ artists: [], pagination: { page: 1, limit: 1, total: 0, totalPages: 0 } });
      }
      const artist = await db.artist.findUnique({
        where: { userId: user.id },
        include: {
          user: { select: { id: true, name: true, avatar: true, email: true } },
          _count: { select: { songs: true, albums: true, followers: true, podcasts: true } },
        },
      });
      if (!artist) {
        return NextResponse.json({ artists: [], pagination: { page: 1, limit: 1, total: 0, totalPages: 0 } });
      }
      return NextResponse.json({
        artists: [{
          id: artist.id,
          userId: artist.userId,
          stageName: artist.stageName,
          avatar: artist.avatar,
          banner: artist.banner,
          bio: artist.bio,
          genre: artist.genre,
          country: artist.country,
          verified: artist.verified,
          monthlyListeners: artist.monthlyListeners,
          totalPlays: artist.totalPlays,
          songCount: artist._count.songs,
          albumCount: artist._count.albums,
          followerCount: artist._count.followers,
          podcastCount: artist._count.podcasts,
          user: artist.user,
          createdAt: artist.createdAt,
        }],
        pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
      });
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { stageName: { contains: search } },
        { genre: { contains: search } },
        { bio: { contains: search } },
        { country: { contains: search } },
      ];
    }

    if (genre) {
      where.genre = genre;
    }

    if (country) {
      where.country = country;
    }

    if (verified === 'true') {
      where.verified = true;
    }

    // Build orderBy
    const validSortFields = ['monthlyListeners', 'totalPlays', 'createdAt', 'stageName'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'monthlyListeners';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const [artists, total] = await Promise.all([
      db.artist.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              email: true,
            },
          },
          _count: {
            select: {
              songs: true,
              albums: true,
              followers: true,
              podcasts: true,
            },
          },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limit,
      }),
      db.artist.count({ where }),
    ]);

    // Format response
    const formattedArtists = artists.map((artist) => ({
      id: artist.id,
      userId: artist.userId,
      stageName: artist.stageName,
      avatar: artist.avatar,
      banner: artist.banner,
      bio: artist.bio,
      genre: artist.genre,
      country: artist.country,
      verified: artist.verified,
      monthlyListeners: artist.monthlyListeners,
      totalPlays: artist.totalPlays,
      songCount: artist._count.songs,
      albumCount: artist._count.albums,
      followerCount: artist._count.followers,
      podcastCount: artist._count.podcasts,
      user: artist.user,
      createdAt: artist.createdAt,
    }));

    return NextResponse.json({
      artists: formattedArtists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[ARTISTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/artists - Create artist profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, stageName, avatar, banner, bio, genre, country } = body;

    // Validate required fields
    if (!userId || !stageName) {
      return NextResponse.json(
        { error: 'userId and stageName are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has an artist profile
    const existingArtist = await db.artist.findUnique({
      where: { userId },
    });

    if (existingArtist) {
      return NextResponse.json(
        { error: 'User already has an artist profile' },
        { status: 409 }
      );
    }

    // Create the artist profile
    const artist = await db.artist.create({
      data: {
        userId,
        stageName,
        avatar: avatar || null,
        banner: banner || null,
        bio: bio || null,
        genre: genre || null,
        country: country || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
          },
        },
        _count: {
          select: {
            songs: true,
            albums: true,
            followers: true,
          },
        },
      },
    });

    // Update user role to creator
    await db.user.update({
      where: { id: userId },
      data: { role: 'creator' },
    });

    return NextResponse.json(
      {
        message: 'Artist profile created successfully',
        artist: {
          id: artist.id,
          userId: artist.userId,
          stageName: artist.stageName,
          avatar: artist.avatar,
          banner: artist.banner,
          bio: artist.bio,
          genre: artist.genre,
          country: artist.country,
          verified: artist.verified,
          monthlyListeners: artist.monthlyListeners,
          totalPlays: artist.totalPlays,
          songCount: artist._count.songs,
          albumCount: artist._count.albums,
          followerCount: artist._count.followers,
          user: artist.user,
          createdAt: artist.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ARTISTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
