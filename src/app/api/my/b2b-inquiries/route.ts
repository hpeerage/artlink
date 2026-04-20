import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { b2bInquiries } from '@/lib/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 내 B2B 문의 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;

    // userId가 일치하거나 로그인 이메일과 문의 이메일이 일치하는 건 조회
    const myInquiries = await db.query.b2bInquiries.findMany({
      where: or(
        eq(b2bInquiries.userId, userId),
        userEmail ? eq(b2bInquiries.email, userEmail) : undefined
      ),
      orderBy: [desc(b2bInquiries.createdAt)],
    });

    return NextResponse.json(myInquiries);
  } catch (error: any) {
    console.error('Error fetching my B2B inquiries:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
