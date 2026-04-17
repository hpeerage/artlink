import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { reviews } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 작품 리뷰 조회 (전체 또는 특정 작품별)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artworkId = searchParams.get('artworkId');

    const results = await db.query.reviews.findMany({
      where: artworkId ? eq(reviews.artworkId, artworkId) : undefined,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          }
        },
        artwork: true,
      },
      orderBy: [desc(reviews.createdAt)],
      limit: 50,
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 신규 리뷰 등록
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { artworkId, rating, comment, imageUrl } = body;
    const userId = (session.user as any).id;

    if (!artworkId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newReview] = await db.insert(reviews).values({
      userId,
      artworkId,
      rating: Number(rating),
      comment,
      imageUrl,
    }).returning();

    return NextResponse.json(newReview);
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
