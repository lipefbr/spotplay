import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// GET /api/auth/seed — Initialize admin account (development only)
export async function GET() {
  // Block in production for security
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint is disabled in production' },
      { status: 403 }
    );
  }

  try {
    const results = {
      admin: { created: false, message: '' },
      artist: { created: false, message: '' },
    };

    // Create admin user if not exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@soundflow.com' },
    });

    let adminUser = existingAdmin;

    if (!existingAdmin) {
      const adminPassword = hashPassword('admin123');
      adminUser = await db.user.create({
        data: {
          email: 'admin@soundflow.com',
          name: 'Admin SpotiPlay',
          username: 'admin_soundflow',
          password: adminPassword,
          role: 'admin',
          plan: 'premium_individual',
          isVerified: true,
          isActive: true,
        },
      });
      results.admin = { created: true, message: 'Admin user created successfully' };
    } else {
      results.admin = { created: false, message: 'Admin user already exists' };
    }

    // Create artist profile for admin if not exists
    if (adminUser) {
      const existingArtist = await db.artist.findUnique({
        where: { userId: adminUser.id },
      });

      if (!existingArtist) {
        await db.artist.create({
          data: {
            userId: adminUser.id,
            stageName: 'Lucas Mendes',
            bio: 'Cantor e compositor de MPB com mais de 10 anos de carreira',
            genre: 'MPB',
            country: 'BR',
            verified: true,
            monthlyListeners: 2500000,
            totalPlays: 45000000,
          },
        });
        results.artist = { created: true, message: 'Artist profile created successfully' };
      } else {
        results.artist = { created: false, message: 'Artist profile already exists' };
      }
    }

    return NextResponse.json(
      {
        message: 'Seed operation completed',
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_SEED]', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
