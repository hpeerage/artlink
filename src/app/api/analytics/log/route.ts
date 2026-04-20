import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { analytics } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 분석 데이터 로그 기록 API (AR 조회, 스냅샷 등)
 */
export async function POST(request: NextRequest) {
  try {
    const { artworkId, eventType, metadata } = await request.json();
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    const log = await db.insert(analytics).values({
      artworkId,
      eventType,
      userId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    }).returning();

    return NextResponse.json({ success: true, data: log });
  } catch (error: any) {
    console.error('Analytics log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
