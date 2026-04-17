import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { users, artworks, subscriptions, payments } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 플랫폼 전체 통계 데이터 조회 (관리자 전용)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. 요약 통계 집계
    const userCount = await db.select({ count: sql`count(*)` }).from(users);
    const artworkCount = await db.select({ count: sql`count(*)` }).from(artworks);
    const subCount = await db.select({ count: sql`count(*)` }).from(subscriptions).where(eq(subscriptions.status, 'active'));
    
    // 2. 총 매출액 (결제 완료 기준)
    const totalRevenue = await db.select({ 
      sum: sql`sum(${payments.amount})` 
    }).from(payments).where(eq(payments.status, 'paid'));

    // 3. 최근 결제 내역 (Top 5)
    const recentPayments = await db.query.payments.findMany({
      orderBy: [desc(payments.createdAt)],
      limit: 5,
      with: {
        user: true,
      } as any
    });

    return NextResponse.json({
      totalUsers: userCount[0]?.count || 0,
      totalArtworks: artworkCount[0]?.count || 0,
      activeSubscriptions: subCount[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.sum || 0,
      recentPayments,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
