import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/app/libs/prisma";
import { z } from "zod";
import { getProduct } from "@/app/libs/microcms";
import { authOptions } from "../../libs/auth";

const FavoriteInput = z.object({
  productId: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId } = FavoriteInput.parse(body);

    // MicroCMSから商品情報を取得して存在確認
    const product = await getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "指定された商品が見つかりません" }, { status: 404 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "無効な入力データです" }, { status: 400 });
    }
    console.error("お気に入りの追加に失敗しました", error);
    return NextResponse.json({ error: "お気に入りの追加に失敗しました" }, { status: 500 });
  }
}