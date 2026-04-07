import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { artworks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artwork = await db.query.artworks.findFirst({
      where: eq(artworks.id, params.id),
      with: {
        subscriptions: {
          where: (subscriptions, { eq }) => eq(subscriptions.status, 'active'),
          limit: 10,
        },
      },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error: any) {
    console.error('Error fetching artwork detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
