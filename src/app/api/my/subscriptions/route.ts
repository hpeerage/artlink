import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { subscriptions } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const results = await db.query.subscriptions.findMany({
      where: eq(subscriptions.userId, userId),
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
