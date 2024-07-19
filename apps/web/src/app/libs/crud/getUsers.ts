import { User } from "@prisma/client";
import { prisma } from "@/app/libs/prisma";

// ユーザーデータを取得する関数
export const getUsers = async () => {
  // ユーザー情報のみを取得
  const users: User[] = await prisma.user.findMany();

  return users;
};
