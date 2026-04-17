import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { artworks, favorites } from '@/lib/db/schema';
import { eq, inArray, notInArray, sql, desc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 개인화된 작품 추천 API
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      // 비로그인 사용자: 최신/인기 작품 추천
      const results = await db.query.artworks.findMany({
        orderBy: [desc(artworks.createdAt)],
        limit: 8,
      });
      return NextResponse.json(results);
    }

    // 1. 유저가 찜한 작품들의 카테고리 추출
    const myFavorites = await db.select({ 
      category: artworks.category,
      artworkId: artworks.id
    })
    .from(favorites)
    .innerJoin(artworks, eq(favorites.artworkId, artworks.id))
    .where(eq(favorites.userId, userId));

    const favoriteCategories = Array.from(new Set(myFavorites.map(f => f.category)));
    const favoriteIds = myFavorites.map(f => f.artworkId);

    if (favoriteCategories.length === 0) {
      // 찜한 목록이 없으면 전체 최신 추천
      const genericResults = await db.query.artworks.findMany({
        orderBy: [desc(artworks.createdAt)],
        limit: 8,
      });
      return NextResponse.json(genericResults);
    }

    // 2. 같은 카테고리의 다른 작품 추천 (이미 찜한 건 제외)
    const recommended = await db.query.artworks.findMany({
      where: and(
        inArray(artworks.category, favoriteCategories as any),
        favoriteIds.length > 0 ? notInArray(artworks.id, favoriteIds as any) : undefined
      ),
      orderBy: [sql`random()`],
      limit: 8,
    });

    // 3. 만약 추천 결과가 부족하면 보충
    if (recommended.length < 4) {
      const fallback = await db.query.artworks.findMany({
         where: favoriteIds.length > 0 ? notInArray(artworks.id, favoriteIds as any) : undefined,
         limit: 4 - recommended.length
      });
      return NextResponse.json([...recommended, ...fallback]);
    }

    return NextResponse.json(recommended);
  } catch (error: any) {
    console.error('Error in recommendation API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
