import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { b2bInquiries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 어드민용 B2B 문의 상태 변경 API
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await db.update(b2bInquiries)
      .set({ status })
      .where(eq(b2bInquiries.id, params.id))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error('Admin B2B update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
