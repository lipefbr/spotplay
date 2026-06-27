import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const results = {
      admin: { created: false, message: '' },
      user: { created: false, message: '' },
    };

    // Create admin user if not exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@soundflow.com' },
    });

    if (!existingAdmin) {
      const adminPassword = hashPassword('admin123');
      await db.user.create({
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

    // Create regular user if not exists
    const existingUser = await db.user.findUnique({
      where: { email: 'user@soundflow.com' },
    });

    if (!existingUser) {
      const userPassword = hashPassword('user123');
      await db.user.create({
        data: {
          email: 'user@soundflow.com',
          name: 'Usuário Demo',
          username: 'user_demo',
          password: userPassword,
          role: 'free',
          plan: 'free',
          isVerified: true,
          isActive: true,
        },
      });
      results.user = { created: true, message: 'Demo user created successfully' };
    } else {
      results.user = { created: false, message: 'Demo user already exists' };
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
