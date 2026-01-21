import { getServerSession } from "next-auth/next";
import ProfileForm from "../../components/profile/ProfileForm";
import { authOptions } from "../libs/auth";
import { prisma } from "../libs/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return <div>アクセスが拒否されました</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <ProfileForm user={user} />
    </div>
  );
}
