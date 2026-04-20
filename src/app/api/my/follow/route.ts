import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { follows } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 작가 팔로우 토글 API
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { followingId } = await request.json();
    const followerId = (session.user as any).id;

    if (!followingId) {
      return NextResponse.json({ error: 'Following ID is required' }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // 기존 팔로우 상태 확인
    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    });

    if (existingFollow) {
      // 언팔로우
      await db.delete(follows).where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );
      return NextResponse.json({ message: 'Unfollowed successfully', status: 'unfollowed' });
    } else {
      // 팔로우
      await db.insert(follows).values({
        followerId,
        followingId
      });
      return NextResponse.json({ message: 'Followed successfully', status: 'followed' });
    }
  } catch (error: any) {
    console.error('Follow API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
