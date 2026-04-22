import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 사용자 권한(role) 수정 API (관리자 전용)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await request.json();
    
    // 유효한 역할인지 검증
    if (!['user', 'artist', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // 자기 자신의 권한을 변경하려는 경우 방지 (최소 1명의 어드민 유지 보장 로직은 생략하되 안전 장치 추가)
    if (id === (session.user as any).id && role !== 'admin') {
      return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 403 });
    }

    const updated = await db.update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
