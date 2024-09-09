import { getUsers } from "@/app/libs/crud/getUsers";
import { prisma } from "@/app/libs/prisma";
// import { uploadToS3 } from "@/app/libs/uploadToS3";
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
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;

    let imageUrl: string | undefined;

    // S3は課金されるので、実装はできたが一旦コメントアウトとする。
    // S3へのアップロード処理を行う
    // if (image) {
    //   const bytes = await image.arrayBuffer();
    //   const buffer = Buffer.from(bytes);

    //   // S3にアップロード
    //   imageUrl = await uploadToS3(buffer, image.name, image.type);
    // }

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, ...(imageUrl && { image: imageUrl }) },
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    //$disconnectは推奨されているので実行する
    await prisma.$disconnect();
  }
};
