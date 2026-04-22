import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { users, artworks, follows } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 작가 공개 프로필 및 작품 목록 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: artistId } = await params;
    const session = await getServerSession(authOptions);
    const myId = (session?.user as any)?.id;

    // 1. 작가 전용 프로필 정보 조회
    const artist = await db.query.users.findFirst({
      where: eq(users.id, artistId),
      columns: {
        id: true,
        name: true,
        image: true,
        role: true,
        bio: true,
        website: true,
        instagramUrl: true,
        otherSnsUrl: true,
      }
    });

    if (!artist || artist.role !== 'artist') {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // 2. 작가의 작품 목록 조회
    const artistArtworks = await db.query.artworks.findMany({
      where: eq(artworks.userId, artistId),
      orderBy: [desc(artworks.createdAt)],
    });

    // 3. 팔로워 수 및 본인 팔로우 여부 확인
    const followerCount = (await db.select().from(follows).where(eq(follows.followingId, artistId))).length;
    let isFollowing = false;
    if (myId) {
       const followRecord = await db.query.follows.findFirst({
         where: and(eq(follows.followerId, myId), eq(follows.followingId, artistId))
       });
       if (followRecord) isFollowing = true;
    }

    return NextResponse.json({
      artist,
      artworks: artistArtworks,
      followerCount,
      isFollowing,
    });
  } catch (error: any) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
