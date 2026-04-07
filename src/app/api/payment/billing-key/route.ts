import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { subscriptions, payments } from '@/lib/db/schema';

/**
 * 빌링키 발급 후 서버 등록 및 첫 결제 처리
 */
export async function POST(request: NextRequest) {
  try {
    const { billingKey, customerId, artworkId, amount } = await request.json();

    if (!billingKey || !customerId || !artworkId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Received billing key for artwork:', artworkId, 'key:', billingKey);

    // 1. Drizzle를 통해 Turso에 저장
    const [newSubscription] = await db.insert(subscriptions).values({
      userId: String(customerId),
      artworkId: String(artworkId),
      billingKey: String(billingKey),
      status: 'active',
      amount: Number(amount),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }).returning();

    // 2. 결제 성공 로그 생성 (Payments 테이블)
    const paymentId = `rental_${Date.now()}`;
    await db.insert(payments).values({
      userId: String(customerId),
      amount: Number(amount),
      paymentType: 'rental',
      status: 'completed',
      merchantUid: paymentId,
      transactionId: `tx_${Date.now()}`,
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
