import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin - Get admin analytics data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y

    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Run all aggregations in parallel
    const [
      totalUsers,
      newUsers,
      activeUsers,
      premiumUsers,
      creatorUsers,
      totalSongs,
      pendingSongs,
      approvedSongs,
      totalArtists,
      verifiedArtists,
      totalPlaylists,
      totalAlbums,
      totalPodcasts,
      totalPayments,
      confirmedPayments,
      totalRevenue,
      subscriptionRevenue,
      adRevenue,
      totalSubscriptions,
      activeSubscriptions,
      totalPlays,
      totalLikes,
      totalComments,
      recentUsers,
      recentSongs,
      recentPayments,
      topGenres,
    ] = await Promise.all([
      // Total users
      db.user.count(),

      // New users in period
      db.user.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Active users (have logged in or played songs in the period)
      db.deviceSession.count({
        where: { lastActive: { gte: startDate } },
      }),

      // Premium users
      db.user.count({
        where: { role: 'premium' },
      }),

      // Creator users
      db.user.count({
        where: { role: 'creator' },
      }),

      // Total songs
      db.song.count(),

      // Pending songs
      db.song.count({
        where: { status: 'pending' },
      }),

      // Approved songs
      db.song.count({
        where: { status: 'approved' },
      }),

      // Total artists
      db.artist.count(),

      // Verified artists
      db.artist.count({
        where: { verified: true },
      }),

      // Total playlists
      db.playlist.count(),

      // Total albums
      db.album.count(),

      // Total podcasts
      db.podcast.count(),

      // Total payments
      db.payment.count({
        where: { createdAt: { gte: startDate } },
      }),

      // Confirmed payments in period
      db.payment.count({
        where: {
          status: 'confirmed',
          createdAt: { gte: startDate },
        },
      }),

      // Total revenue in period
      db.payment.aggregate({
        where: {
          status: 'confirmed',
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),

      // Subscription revenue in period
      db.payment.aggregate({
        where: {
          status: 'confirmed',
          subscriptionId: { not: null },
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      }),

      // Ad revenue (placeholder - would come from AdCampaign)
      db.adCampaign.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { spent: true },
      }),

      // Total subscriptions
      db.subscription.count(),

      // Active subscriptions
      db.subscription.count({
        where: { status: 'active' },
      }),

      // Total plays
      db.song.aggregate({
        _sum: { playCount: true },
      }),

      // Total likes
      db.song.aggregate({
        _sum: { likeCount: true },
      }),

      // Total comments
      db.comment.count(),

      // Recent registrations
      db.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          createdAt: true,
        },
      }),

      // Recent songs (pending approval)
      db.song.findMany({
        where: { status: 'pending' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: {
            select: {
              id: true,
              stageName: true,
              avatar: true,
            },
          },
        },
      }),

      // Recent payments
      db.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      // Top genres by song count
      db.song.groupBy({
        by: ['genre'],
        where: {
          status: 'approved',
          genre: { not: null },
        },
        _count: { genre: true },
        orderBy: { _count: { genre: 'desc' } },
        take: 10,
      }),
    ]);

    // Calculate conversion rate
    const conversionRate = totalUsers > 0
      ? ((premiumUsers / totalUsers) * 100).toFixed(2)
      : '0';

    // Calculate ARPU (Average Revenue Per User)
    const totalRevenueValue = totalRevenue._sum.amount || 0;
    const arpu = totalUsers > 0
      ? (totalRevenueValue / totalUsers).toFixed(2)
      : '0';

    return NextResponse.json({
      period,
      dateRange: {
        start: startDate,
        end: now,
      },
      overview: {
        users: {
          total: totalUsers,
          new: newUsers,
          active: activeUsers,
          premium: premiumUsers,
          creators: creatorUsers,
          conversionRate: parseFloat(conversionRate),
        },
        content: {
          songs: totalSongs,
          pendingSongs,
          approvedSongs,
          artists: totalArtists,
          verifiedArtists,
          albums: totalAlbums,
          playlists: totalPlaylists,
          podcasts: totalPodcasts,
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          subscriptions: subscriptionRevenue._sum.amount || 0,
          ads: adRevenue._sum.spent || 0,
          arpu: parseFloat(arpu),
          currency: 'BRL',
        },
        engagement: {
          totalPlays: totalPlays._sum.playCount || 0,
          totalLikes: totalLikes._sum.likeCount || 0,
          totalComments,
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          payments: totalPayments,
          confirmedPayments,
        },
      },
      recentActivity: {
        users: recentUsers,
        pendingSongs: recentSongs,
        payments: recentPayments,
      },
      topGenres: topGenres.map((g) => ({
        genre: g.genre,
        count: g._count.genre,
      })),
    });
  } catch (error) {
    console.error('[ADMIN_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
