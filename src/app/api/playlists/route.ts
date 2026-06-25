import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/playlists - List user playlists
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isPublic = searchParams.get('isPublic');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      OR: [
        { userId },
        { collaborators: { some: { userId } } },
      ],
    };

    // If filtering by public status
    if (isPublic === 'true') {
      where.isPublic = true;
    }

    const [playlists, total] = await Promise.all([
      db.playlist.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          songs: {
            include: {
              song: {
                include: {
                  artist: {
                    select: {
                      id: true,
                      stageName: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
            orderBy: { position: 'asc' },
          },
          tags: true,
          _count: {
            select: { songs: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.playlist.count({ where }),
    ]);

    // Format response
    const formattedPlaylists = playlists.map((playlist) => ({
      id: playlist.id,
      userId: playlist.userId,
      name: playlist.name,
      description: playlist.description,
      coverUrl: playlist.coverUrl,
      isPublic: playlist.isPublic,
      isCollaborative: playlist.isCollaborative,
      playCount: playlist.playCount,
      songCount: playlist._count.songs,
      tags: playlist.tags.map((t) => t.tag),
      user: playlist.user,
      songs: playlist.songs.map((ps) => ({
        id: ps.song.id,
        title: ps.song.title,
        duration: ps.song.duration,
        coverUrl: ps.song.coverUrl,
        artist: ps.song.artist,
        position: ps.position,
      })),
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
    }));

    return NextResponse.json({
      playlists: formattedPlaylists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[PLAYLISTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/playlists - Create new playlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, description, coverUrl, isPublic, isCollaborative, tags, songIds } = body;

    // Validate required fields
    if (!userId || !name) {
      return NextResponse.json(
        { error: 'userId and name are required' },
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

    // Create the playlist
    const playlist = await db.playlist.create({
      data: {
        userId,
        name,
        description: description || null,
        coverUrl: coverUrl || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        isCollaborative: isCollaborative || false,
        tags: tags
          ? {
              create: tags.map((tag: string) => ({ tag })),
            }
          : undefined,
        songs: songIds
          ? {
              create: songIds.map((songId: string, index: number) => ({
                songId,
                position: index,
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        songs: {
          include: {
            song: {
              include: {
                artist: {
                  select: {
                    id: true,
                    stageName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { position: 'asc' },
        },
        tags: true,
        _count: {
          select: { songs: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Playlist created successfully',
        playlist: {
          id: playlist.id,
          userId: playlist.userId,
          name: playlist.name,
          description: playlist.description,
          coverUrl: playlist.coverUrl,
          isPublic: playlist.isPublic,
          isCollaborative: playlist.isCollaborative,
          playCount: playlist.playCount,
          songCount: playlist._count.songs,
          tags: playlist.tags.map((t) => t.tag),
          user: playlist.user,
          songs: playlist.songs.map((ps) => ({
            id: ps.song.id,
            title: ps.song.title,
            duration: ps.song.duration,
            coverUrl: ps.song.coverUrl,
            artist: ps.song.artist,
            position: ps.position,
          })),
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[PLAYLISTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
