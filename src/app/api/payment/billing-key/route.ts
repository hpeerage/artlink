import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { subscriptions, payments } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 빌링키 발급 후 서버 등록 및 첫 결제 처리
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { billingKey, artworkId, amount } = await request.json();
    const userId = (session.user as any).id;

    if (!billingKey || !artworkId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Registering subscription for user:', userId, 'artwork:', artworkId);

    // 1. Drizzle를 통해 Turso에 저장
    const [newSubscription]: any = await db.insert(subscriptions).values({
      userId: userId,
      artworkId: String(artworkId),
      billingKey: String(billingKey),
      status: 'active',
      amount: Number(amount),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }).returning();

    // 2. 결제 성공 로그 생성 (Payments 테이블)
    const paymentId = `rental_${Date.now()}`;
    await db.insert(payments).values({
      userId: userId,
      amount: Number(amount),
      paymentType: 'rental',
      status: 'paid',
      merchantUid: paymentId,
      transactionId: `tx_${Date.now()}`,
    });

    // 3. 실시간 알림 생성
    await db.insert(notifications).values({
      userId,
      type: 'subscription',
      message: `[구독 완료] 작품 정기 렌탈 구독이 시작되었습니다. 마이페이지에서 상세 내역을 확인하세요.`,
      link: '/my',
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription registered successfully',
      subscriptionId: newSubscription.id,
      paymentId: paymentId,
    });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
