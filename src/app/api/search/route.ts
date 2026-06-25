import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/search - Search across songs, artists, playlists, podcasts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, songs, artists, playlists, podcasts
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query (q) is required' },
        { status: 400 }
      );
    }

    const query = q.trim();
    const results: Record<string, unknown> = {};

    // Search songs
    if (type === 'all' || type === 'songs') {
      const songs = await db.song.findMany({
        where: {
          status: 'approved',
          OR: [
            { title: { contains: query } },
            { genre: { contains: query } },
            { artist: { stageName: { contains: query } } },
            { album: { title: { contains: query } } },
          ],
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
        take: limit,
        orderBy: { playCount: 'desc' },
      });
      results.songs = songs;
    }

    // Search artists
    if (type === 'all' || type === 'artists') {
      const artists = await db.artist.findMany({
        where: {
          OR: [
            { stageName: { contains: query } },
            { genre: { contains: query } },
            { bio: { contains: query } },
            { country: { contains: query } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
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
        take: limit,
        orderBy: { monthlyListeners: 'desc' },
      });
      results.artists = artists;
    }

    // Search playlists
    if (type === 'all' || type === 'playlists') {
      const playlists = await db.playlist.findMany({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { tags: { some: { tag: { contains: query } } } },
          ],
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
          _count: {
            select: { songs: true },
          },
        },
        take: limit,
        orderBy: { playCount: 'desc' },
      });
      results.playlists = playlists;
    }

    // Search podcasts
    if (type === 'all' || type === 'podcasts') {
      const podcasts = await db.podcast.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
            { artist: { stageName: { contains: query } } },
          ],
        },
        include: {
          artist: {
            select: {
              id: true,
              stageName: true,
              avatar: true,
            },
          },
          _count: {
            select: { episodes: true },
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      results.podcasts = podcasts;
    }

    return NextResponse.json({
      query,
      results,
    });
  } catch (error) {
    console.error('[SEARCH_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
