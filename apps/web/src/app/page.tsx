// import { useSession, signIn, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next";
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'
// import SessionTip from '@/app/components/SessionTip'
import { authOptions } from "@/app/libs/auth";
import { Products } from "./products/components/Products";

export default async function Home() {
  // サーバーセッション
  const session = await getServerSession(authOptions);

  const getUserList = async () => {
    const res = await fetch(`${process.env.BASE_URL}/api/user`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json.users;
  };

  let userList = [];
  if (session != null) {
    userList = await getUserList();
  }
  /**
   *
   * sessionがない場合はsignページにリダイレクト
   */
  // const redirectSignin = () => {
  //   if (!session) {
  //     const signInUrl = `${process.env.BASE_URL}/signin`; // リダイレクト先のURLを構築// リダイレクト先のURLを構築
  //     return (
  //       NextResponse.redirect(signInUrl)// リダイレクトを実行
  //     )
  //   }
  // }
  // redirectSignin()
  /**
   * サーバー側でのsessionの判定
   */
  // if (!session) {
  //   return redirect('/signin');
  // }

  // if (session === "loading") {
  //   return <p>Hang on there...</p>
  // }

  return (
    <>
      <Products />
      {/* メール送信用コンポーネント コメントアウト*/}
      {/* <SendMail /> */}
      {/* <Productsdemo /> */}
    </>
  );
}
