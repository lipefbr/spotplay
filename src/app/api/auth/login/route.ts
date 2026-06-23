import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

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
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Conta desativada. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Compare hashed password
    if (!user.password || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      );
    }

    // Check two-factor authentication
    if (user.twoFactorEnabled) {
      return NextResponse.json(
        {
          message: 'Autenticação de dois fatores necessária',
          requiresTwoFactor: true,
          userId: user.id,
        },
        { status: 200 }
      );
    }

    // Generate token for session
    const token = generateToken(user.id);

    return NextResponse.json(
      {
        message: 'Login realizado com sucesso',
        user: sanitizeUser(user),
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_LOGIN]', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
