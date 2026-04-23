import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/turso';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 플랫폼 설정 조회 및 업데이트 API (관리자 전용)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allSettings = await db.select().from(settings);
    // 키-값 객체로 변환하여 반환
    const config = allSettings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // 다중 설정(settings 객체) 또는 단일 설정(key, value) 처리
    const settingsToUpdate: Record<string, string> = body.settings || (body.key ? { [body.key]: body.value } : {});

    if (Object.keys(settingsToUpdate).length === 0) {
      return NextResponse.json({ error: 'No settings provided' }, { status: 400 });
    }

    console.log(`[AdminSettings] Processing batch update:`, Object.keys(settingsToUpdate));

    for (const [key, value] of Object.entries(settingsToUpdate)) {
      if (value === undefined) continue;

      // 기존 설정 확인 (Upsert 대용)
      const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);

      if (existing.length > 0) {
        await db.update(settings)
          .set({ value: String(value), updatedAt: new Date().toISOString() })
          .where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({
          key,
          value: String(value),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
