import { PrismaClient, Prisma, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUsers } from "@/app/libs/crud/getUsers";
import { prisma } from "@/app/libs/prisma";

// ユーザー情報とそのプロファイル情報を取得する
export const GET = async (req: Request) => {
  try {
    // await connect();
    // ユーザー情報と紐づくプロファイル情報を取得
    const users = await getUsers();

    console.log(users);
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    //$disconnectは推奨されているので実行する
    await prisma.$disconnect();
  }
};
