import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { reviews } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 내가 작성한 리뷰 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const myReviews = await db.query.reviews.findMany({
      where: eq(reviews.userId, userId),
      with: {
        artwork: {
          columns: {
            id: true,
            title: true,
            image_url: true,
          }
        }
      },
      orderBy: [desc(reviews.createdAt)],
    });

    return NextResponse.json(myReviews);
  } catch (error: any) {
    console.error('Error fetching my reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
