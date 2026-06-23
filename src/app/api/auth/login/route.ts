import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to strip sensitive fields from user object
function sanitizeUser(user: Record<string, unknown>) {
  const { password, twoFactorSecret, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // In production, compare hashed password with bcrypt/argon2
    // For now, we do a direct comparison (to be replaced with proper hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check two-factor authentication
    if (user.twoFactorEnabled) {
      return NextResponse.json(
        {
          message: 'Two-factor authentication required',
          requiresTwoFactor: true,
          userId: user.id,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: sanitizeUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_LOGIN]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
