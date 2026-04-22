import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/turso';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 이메일 중복 확인
    const [existingUser]: any = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 명시적으로 ID 생성 (crypto.randomUUID() 사용)
    const newId = crypto.randomUUID();

    // 사용자 생성 (일부 SQLite/Turso 환경에서 불안정할 수 있는 returning()을 제거하고 명시적 삽입 시도)
    await db.insert(users).values({
      id: newId,
      name,
      email,
      password: hashedPassword,
      role: 'user', // 기본 역할 설정
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newId,
        name,
        email,
      }
    });

  } catch (error: any) {
    console.error('Detailed Registration Error:', error);
    return NextResponse.json({ 
      error: '회원가입 중 서버 오류가 발생했습니다.',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
