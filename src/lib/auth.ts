import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/turso";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const [user]: any = await db.select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        // 인증 성공 시 필요한 필드만 명시적으로 구성하여 반환 (중요: id, role 필드 보장)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      // 첫 로그인 시 user 객체가 전달됨
      if (user) {
        console.log('Auth: Setting ID and ROLE into JWT from user object', { id: user.id, role: user.role });
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      // JWT 토큰에 보관된 정보를 세션 객체로 전송
      if (session?.user) {
        console.log('Auth: Syncing ID and ROLE from JWT to Session', { id: token.id, role: token.role });
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  } as any,
  secret: process.env.NEXTAUTH_SECRET,
};
