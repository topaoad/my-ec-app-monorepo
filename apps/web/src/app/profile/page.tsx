import { getServerSession } from "next-auth/next";
import { authOptions } from "../libs/auth";
import ProfileForm from "../components/profile/ProfileForm";
import { prisma } from "../libs/prisma";
import React from "react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <div>アクセスが拒否されました</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
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
