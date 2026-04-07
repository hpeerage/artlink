import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/turso";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }

    const [existingUser] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      email,
      name,
      password: hashedPassword
    }).returning();

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error details:", {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        message: "회원가입 처리 중 오류가 발생했습니다.",
        debug: error.message 
      },
      { status: 500 }
    );
  }
}
