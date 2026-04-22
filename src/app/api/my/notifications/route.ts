import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { notifications } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import { getToken } from 'next-auth/jwt';

/**
 * 내 알림 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    // 1. getToken으로 직접 토큰 확인 (App Router API Route에서 더 안정적)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // 2. getServerSession으로 교차 확인
    const session = await getServerSession(authOptions);
    
    console.log('--- Notification Auth Debug ---');
    console.log('Token exists:', !!token);
    console.log('Session exists:', !!session);

    const user = token || session?.user;

    if (!user) {
      console.warn('Unauthorized access attempt to notifications');
      return NextResponse.json({ error: 'Unauthorized', debug: 'No session or token found' }, { status: 401 });
    }

    const userId = (user as any).id || (user as any).sub;
    console.log('Extracted UserId from Auth:', userId);

    if (!userId) {
      console.error('Error: UserId is missing in both token and session!');
      return NextResponse.json({ error: '사용자 식별 정보를 찾을 수 없습니다.' }, { status: 400 });
    }

    const results = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Detailed Notification Error:', error);
    return NextResponse.json({ 
      error: '알림 목록을 불러오는데 실패했습니다.',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

/**
 * 알림 읽음 처리
 */
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const session = await getServerSession(authOptions);
    const user = token || session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId } = await request.json();
    const userId = (user as any).id || (user as any).sub;

    if (notificationId) {
      // 특정 알림 읽음 처리
      await db.update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId)
          )
        );
    } else {
      // 모든 알림 읽음 처리
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
