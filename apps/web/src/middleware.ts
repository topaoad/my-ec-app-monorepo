import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";




export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/signin");
    const isProfilePage = req.nextUrl.pathname.startsWith("/profile");
    const isProtectedPage = req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/orders") || req.nextUrl.pathname.startsWith("/favorites");

    // ログイン済みユーザーがサインインページにアクセスした場合、ホームページにリダイレクト
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 初回ログインユーザーがプロフィールページ以外にアクセスした場合、プロフィールページにリダイレクト
    if (token && token?.isNewUser && !isProfilePage) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }


    // 未ログインユーザーが保護されたページにアクセスした場合、サインインページにリダイレクト
    if (!token && isProtectedPage) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // その他の場合は通常のアクセスを許可
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 保護されたページへのアクセスのみをチェック
        // お気に入り、プロフィール、注文履歴ページはログインが必要 ※カートページはログイン不要
        if (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/orders") || req.nextUrl.pathname.startsWith("/favorites")) {
          return !!token;
        }
        // その他のページは常に許可
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/signin",
    "/profile/:path*",
    "/orders/:path*",
    "/favorites/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};