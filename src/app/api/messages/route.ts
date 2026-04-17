import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { messages } from '@/lib/db/schema';
import { eq, or, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 상대방과의 대화 내역 조회
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('userId');
    const myId = (session.user as any).id;

    if (!otherUserId) {
      return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 });
    }

    const results = await db.query.messages.findMany({
      where: or(
        and(eq(messages.senderId, myId), eq(messages.receiverId, otherUserId)),
        and(eq(messages.senderId, otherUserId), eq(messages.receiverId, myId))
      ),
      orderBy: [desc(messages.createdAt)],
      limit: 100,
    });

    return NextResponse.json(results.reverse());
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 메시지 전송
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;
    const senderId = (session.user as any).id;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newMessage] = await db.insert(messages).values({
      senderId,
      receiverId,
      content,
    }).returning();

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
