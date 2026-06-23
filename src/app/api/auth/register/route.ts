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
    const { email, name, password, username, role } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if username already taken (if provided)
    if (username) {
      const existingUsername = await db.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }

    // Validate role
    const validRoles = ['free', 'premium', 'creator', 'moderator', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'free';

    // In production, hash the password with bcrypt/argon2
    // For now, we store it directly (to be replaced with proper hashing)
    const user = await db.user.create({
      data: {
        email,
        name,
        username: username || null,
        password,
        role: userRole,
        plan: userRole === 'premium' ? 'premium_individual' : 'free',
      },
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: sanitizeUser(user),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[AUTH_REGISTER]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
