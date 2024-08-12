import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { randomUUID, randomBytes } from "crypto";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID ?? "",
      clientSecret: process.env.LINE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        // 初回ログインユーザーかどうかを判定
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { lastLogin: true },
        });
        token.isNewUser = !dbUser?.lastLogin;

        // Update lastLogin
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      return baseUrl;
    },
    async signIn({ user, account, profile }: any) {
      return true;
    },
  },
  session: {
    // "jwt"と"database"の2つのストラテジーが利用可能
    // デフォルトは"jwt"だが、"database"を使用することでセッションの永続化が可能
    strategy: "jwt",
    // strategy: "database",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  pages: {
    error: "/error",
  },
};

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
// ハンドラーのエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
