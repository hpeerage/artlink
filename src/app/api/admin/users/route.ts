import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 플랫폼 전체 사용자 목록 조회 (관리자 전용)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      image: users.image,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
