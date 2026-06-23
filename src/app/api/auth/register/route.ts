import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// Helper to strip sensitive fields from user object
function sanitizeUser(user: Record<string, unknown>) {
  const { password, twoFactorSecret, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, username, password } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, nome e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado' },
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
          { error: 'Este nome de usuário já está em uso' },
          { status: 409 }
        );
      }
    }

    // Hash the password with SHA-256
    const hashedPassword = hashPassword(password);

    // Generate a username from email if not provided
    const generatedUsername = username || email.split('@')[0] + '_' + Date.now().toString(36);

    // Create user with default role='free' and plan='free'
    const user = await db.user.create({
      data: {
        email,
        name,
        username: generatedUsername,
        password: hashedPassword,
        role: 'free',
        plan: 'free',
      },
    });

    return NextResponse.json(
      {
        message: 'Usuário registrado com sucesso',
        user: sanitizeUser(user),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[AUTH_REGISTER]', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
