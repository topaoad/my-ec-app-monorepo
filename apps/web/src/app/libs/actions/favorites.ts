"use server";

import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth";
import { prisma } from "../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const FavoriteInput = z.object({
  productId: z.string(),
});

export async function addToFavorites(input: z.infer<typeof FavoriteInput>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("認証が必要です");
    }

    const { productId } = FavoriteInput.parse(input);
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });
    // /favoritesのキャッシュを再生成
    revalidatePath("/favorites");
    return { success: true, favorite };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      // 既に登録がある＝ユニーク制約違反の場合
      return { success: false, error: "ALREADY_FAVORITED" };
    }
    // その他のエラーの場合
    console.error("Failed to add to favorites:", error);
    return { success: false, error: "UNKNOWN_ERROR" };
  }
}

