import React from 'react';
import { db } from '@/lib/turso';
import { artworks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ArtworkDetailClient from '@/components/artwork/ArtworkDetailClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await db.query.artworks.findFirst({
    where: eq(artworks.id, id),
  });

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">작품을 찾을 수 없습니다.</h2>
          <Link href="/explore" className="text-primary hover:underline">목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  // Map Drizzle camelCase to existing frontend snake_case
  const mappedArtwork = {
    ...artwork,
    price_buy: artwork.priceBuy,
    price_rental: artwork.priceRental,
    image_url: artwork.imageUrl || '',
    model_url: artwork.modelUrl || '',
    description: artwork.description || '',
    category: artwork.category || 'Fine Art',
  };

  return <ArtworkDetailClient artwork={mappedArtwork as any} />;
}
