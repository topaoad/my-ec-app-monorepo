import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { randomUUID, randomBytes } from "crypto";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Prismaアダプターでセッション情報などを取得できているが、callback内のsignIn関数でも取得しているので少々冗長かも
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
    // SlackProvider({
    //   clientId: process.env.SLACK_CLIENT_ID ?? '',
    //   clientSecret: process.env.SLACK_CLIENT_SECRET ?? '',
    // }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        // ユーザーIDをセッションに追加
        console.log("session情報⭐️", session);
      }
      return session;
    },
    // サインイン後にリダイレクトする
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    // サインイン関数実行時にコールバックされる
    async signIn({ user, account }) {
      // Userテーブルにユーザー情報を格納
      console.log("user情報⭐️", user);
      console.log("account情報⭐️", account);

      const userData = {
        email: user.email,
        name: user.name,
        image: user.image,
      };

      // Userテーブルにデータを格納※メールアドレスが取得できる場合のみ
      if (user.email) {
        const createdUser = await prisma.user.upsert({
          where: { email: user.email },
          create: userData,
          update: userData,
        });

        // Accountテーブルにアカウント情報を格納
        if (account && account.providerAccountId) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            create: {
              userId: createdUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            update: {
              userId: createdUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });
        }
      }
      return true;
    },
  },
  session: {
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // strategy: "database",
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge:  24 * 60 * 60, // 30 days
    maxAge: 24 * 60, // 1 hour

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours

    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  pages: {
    // signIn: '/auth/signin',
    //   // signOut: '/auth/signout',
    //   // error: '/auth/error', // Error code passed in query string as ?error=
    //   // verifyRequest: '/auth/verify-request', // (used for check email message)
    //   // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //   error: '/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
