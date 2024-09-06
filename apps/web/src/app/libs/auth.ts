import { stripe } from "@/app/libs/stripe";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { randomBytes, randomUUID } from "crypto";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // allowDangerousEmailAccountLinkingをtrueに設定
      // これにより、Googleアカウントのメールアドレスが変更された場合にも、
      // 以前のアカウントとのリンクを維持できる　検証用としては有効だが、本番環境では使用しないこと
      allowDangerousEmailAccountLinking: true,
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
    async redirect({ url, baseUrl }) {
      // URLSearchParams を使用して callbackUrl を取得
      const urlObj = new URL(url, baseUrl);
      const callbackUrl = urlObj.searchParams.get("callbackUrl");

      if (callbackUrl) {
        // callbackUrl が対象パス
        const allowedPaths = ["/cart", "/profile", "/orders", "/favorites"];
        const isAllowedPath = allowedPaths.some((path) =>
          callbackUrl.startsWith(path),
        );

        if (isAllowedPath) {
          const fullCallbackUrl = `${baseUrl}${callbackUrl}`;
          return fullCallbackUrl;
        }
      }

      // その他の処理は変更なし
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, stripeCustomerId: true },
          });

          if (!dbUser) {
            // 新規ユーザーの場合、Stripe顧客を作成
            const stripeCustomer = await stripe.customers.create({
              email: user.email!,
              name: user.name || undefined,
            });

            // 新規ユーザーを作成し、Stripe顧客IDを保存
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || null,
                image: user.image || null,
                stripeCustomerId: stripeCustomer.id,
              },
            });
          } else if (!dbUser.stripeCustomerId) {
            // 既存ユーザーでStripe顧客IDがない場合、Stripe顧客を作成して更新
            const stripeCustomer = await stripe.customers.create({
              email: user.email!,
              name: user.name || undefined,
            });

            await prisma.user.update({
              where: { id: dbUser.id },
              data: { stripeCustomerId: stripeCustomer.id },
            });
          }

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
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
  // イベントハンドラーを登録　使わないので一旦コメントアウト
  // events: {
  //   async signIn(message) {
  //     console.log("Successful sign in event:", message);
  //   },
  //   async signOut(message) {
  //     console.log("Successful sign out event:", message);
  //   },
  //   async createUser(message) {
  //     console.log("Successful create user event:", message);
  //   },
  //   async updateUser(message) {
  //     console.log("Successful update user event:", message);
  //   },
  //   async linkAccount(message) {
  //     console.log("Successful link account event:", message);
  //   },
  //   async session(message) {
  //     console.log("Successful session event:", message);
  //   },
  // },
  pages: {
    error: "/error",
  },
};

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
// ハンドラーのエクスポート
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
