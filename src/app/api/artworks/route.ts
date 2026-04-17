import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { artworks } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 작품 목록 조회 및 신규 작품 등록
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    const filters = [];
    if (category && category !== 'All') filters.push(eq(artworks.category, category));
    if (userId) filters.push(eq(artworks.userId, userId));

    const results = await db.query.artworks.findMany({
      where: filters.length > 0 ? (filters.length > 1 ? and(...filters) : filters[0]) : undefined,
      orderBy: [desc(artworks.createdAt)],
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { title, artist, description, category, price_buy, price_rental, image_url, model_url, width_mm, height_mm } = body;

    const [newArtwork] = await db.insert(artworks).values({
      userId: (session?.user as any)?.id || null, // 로그인한 사용자 정보 저장
      title,
      artist,
      description,
      category,
      priceBuy: Number(price_buy),
      priceRental: Number(price_rental),
      widthMm: Number(width_mm || 0),
      heightMm: Number(height_mm || 0),
      imageUrl: image_url,
      modelUrl: model_url,
    }).returning();

    return NextResponse.json(newArtwork);
  } catch (error: any) {
    console.error('Error creating artwork:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
