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
    console.log('--- [Kakao Alimtalk Simulation] ---');
    console.log(`To Admin: [ArtLink] 신규 B2B 문의가 접수되었습니다.`);
    console.log(`회사명: ${companyName}`);
    console.log(`담당자: ${managerName}님 (${phone})`);
    console.log(`내용: ${message?.substring(0, 50)}...`);
    console.log('-----------------------------------');

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry submitted successfully. Alimtalk notification sent to admin (simulated).',
      data: newInquiry 
    });
  } catch (error: any) {
    console.error('B2B Inquiry API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
