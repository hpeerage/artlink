import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { b2bInquiries } from '@/lib/db/schema';

/**
 * B2B 법인 문의 접수 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyName, 
      managerName, 
      email, 
      phone, 
      spaceSize, 
      budget, 
      preferredDate, 
      message 
    } = body;

    // 1. 필수 필드 검증
    if (!companyName || !managerName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. DB 저장
    const [newInquiry] = await db.insert(b2bInquiries).values({
      companyName,
      managerName,
      email,
      phone,
      spaceSize,
      budget,
      preferredDate,
      message,
      status: 'pending',
    }).returning();

    // 3. 카카오 알림톡(시뮬레이션) 전송 로직
    // 실제 서비스에서는 외부 알림톡 API (예: Solapi, Aligo 등)를 호출합니다.
    console.log('\n--- [Kakao Alimtalk Simulation: Admin Notification] ---');
    console.log(`[ArtLink B2B] 신규 법인 문의 접수`);
    console.log(`- 회사명: ${companyName}`);
    console.log(`- 담당자: ${managerName}님`);
    console.log(`- 연락처: ${phone} / ${email}`);
    console.log(`- 예산 규모: ${budget || '미정'}`);
    console.log(`- 문의 내용: ${message?.substring(0, 100)}...`);
    console.log(`- 접수 일시: ${new Date().toLocaleString()}`);
    console.log('--- [End Simulation] ---\n');

    return NextResponse.json({ 
      success: true, 
      message: 'B2B inquiry received successfully. Admin has been notified via Alimtalk (Simulated).',
      inquiryId: newInquiry.id,
      submittedAt: newInquiry.createdAt
    });
  } catch (error: any) {
    console.error('B2B Inquiry API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
