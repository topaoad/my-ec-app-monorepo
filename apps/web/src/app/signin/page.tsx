import { authOptions } from "@/app/libs/auth";
import SessionTip from "@/components/SessionTip";
import { getServerSession } from "next-auth/next";

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

  return (
    <>
      <SessionTip session={session} />
    </>
  );
}
