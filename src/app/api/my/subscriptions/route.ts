import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { subscriptions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 실제 서비스에서는 auth context에서 user_id를 가져와야 함
    // 현재는 테스트를 위해 전체 구독 내역을 반환하거나 특정 익명 ID를 사용
    const results = await db.query.subscriptions.findMany({
      with: {
        artwork: true,
      },
      orderBy: [desc(subscriptions.createdAt)],
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
