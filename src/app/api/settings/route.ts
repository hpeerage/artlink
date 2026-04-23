import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db } from '@/lib/turso';
import { settings } from '@/lib/db/schema';

/**
 * 플랫폼 공개 설정 조회 API (로그인 불필요)
 */
export async function GET(request: NextRequest) {
  try {
    const allSettings = await db.select().from(settings);
    
    // 공개해도 되는 설정 키들만 필터링 (필요 시)
    const publicKeys = ['hero_image_url', 'hero_title', 'hero_subtitle', 'hero_artwork_title', 'hero_artwork_subtitle'];
    
    const config = allSettings.reduce((acc: any, curr) => {
      if (publicKeys.includes(curr.key)) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
