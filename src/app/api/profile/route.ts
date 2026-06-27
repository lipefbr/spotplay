import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT /api/profile — Update user profile (name, avatar)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, avatar } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: { name?: string; avatar?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        plan: updatedUser.plan,
        isVerified: updatedUser.isVerified,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[PROFILE_PUT]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
