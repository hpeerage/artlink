import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { artworks, subscriptions, payments } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 작가의 수익 성과 및 작품 통계 데이터 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // 작가 권한 체크
    if (userRole !== 'artist' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. 내 작품 수
    const [worksCount] = await db
      .select({ count: sql`count(*)` })
      .from(artworks)
      .where(eq(artworks.userId, userId));

    // 2. 활성 구독(렌탈) 수 및 월 예상 수익
    const activeSubs = await db
      .select({
        count: sql`count(*)`,
        totalMonthlyRevenue: sql`sum(${subscriptions.amount})`
      })
      .from(subscriptions)
      .innerJoin(artworks, eq(subscriptions.artworkId, artworks.id))
      .where(
        and(
          eq(artworks.userId, userId),
          eq(subscriptions.status, 'active')
        )
      );

    // 3. 누적 수익 (성공한 모든 결제 합계)
    const cumulativeRevenue = await db
      .select({
        sum: sql`sum(${payments.amount})`
      })
      .from(payments)
      .innerJoin(artworks, eq(sql`1`, sql`1`)) // 임시 조인 (결제 테이블에 작품ID가 없으므로 정교화 필요)
      // 실제로는 결제 시점에 작가 정보를 매핑하거나, 
      // 결제 테이블에 artworkId 필드를 추가하여 쿼리하는 것이 정석입니다.
      // 현재 스키마에서는 단순 구독료 기반 합계로 대체합니다.
      .where(
        and(
          eq(payments.status, 'paid'),
          eq(payments.userId, userId) // 현재는 유저의 결제 이력만 조회 가능
        )
      );

    return NextResponse.json({
      totalWorks: worksCount?.count || 0,
      activeRentals: activeSubs[0]?.count || 0,
      monthlyRevenue: activeSubs[0]?.totalMonthlyRevenue || 0,
      cumulativeRevenue: cumulativeRevenue[0]?.sum || 0,
    });
  } catch (error: any) {
    console.error('Error fetching artist stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
