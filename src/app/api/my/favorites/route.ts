import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { favorites } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 내가 찜한 작품 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const results = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: {
        artwork: true,
      },
      orderBy: [desc(favorites.createdAt)],
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 관심 작품 찜하기 토글 (Add/Remove)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artworkId } = await request.json();
    const userId = (session.user as any).id;

    if (!artworkId) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    // 이미 찜했는지 확인
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.artworkId, artworkId)
      ),
    });

    if (existing) {
      // 찜 취소
      await db.delete(favorites).where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.artworkId, artworkId)
        )
      );
      return NextResponse.json({ active: false });
    } else {
      // 찜 추가
      await db.insert(favorites).values({
        userId,
        artworkId,
      });
      return NextResponse.json({ active: true });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
