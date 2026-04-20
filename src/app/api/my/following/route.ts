import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { follows, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 내가 팔로우한 작가 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 팔로우 테이블에서 내가 팔로잉하는 목록 조회 (작가 정보 포함)
    const followingList = await db.query.follows.findMany({
      where: eq(follows.followerId, userId),
      with: {
        following: {
          columns: {
            id: true,
            name: true,
            image: true,
            bio: true,
          }
        }
      },
      orderBy: [desc(follows.createdAt)],
    });

    return NextResponse.json(followingList);
  } catch (error: any) {
    console.error('Error fetching following list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
