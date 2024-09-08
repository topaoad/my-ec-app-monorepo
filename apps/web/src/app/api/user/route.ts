import { getUsers } from "@/app/libs/crud/getUsers";
import { prisma } from "@/app/libs/prisma";
import { NextResponse } from "next/server";

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

// ユーザー情報とそのプロファイル情報を更新する
export const PUT = async (req: Request) => {
  try {
    const { id, name } = await req.json();
    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    //$disconnectは推奨されているので実行する
    await prisma.$disconnect();
  }
};
