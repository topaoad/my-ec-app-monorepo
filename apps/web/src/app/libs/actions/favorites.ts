"use server";

import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth";
import { prisma } from "../prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Product, getProductsByIds } from "@/app/libs/microcms";
import { MicroCMSListResponse } from "microcms-js-sdk";
import { Session } from "@/types/session";

const FavoriteInput = z.object({
  productId: z.string(),
});

export async function addToFavorites(input: z.infer<typeof FavoriteInput>) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
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
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // 既に登録がある＝ユニーク制約違反の場合
      return { success: false, error: "ALREADY_FAVORITED" };
    }
    // その他のエラーの場合
    console.error("Failed to add to favorites:", error);
    return { success: false, error: "UNKNOWN_ERROR" };
  }
}

export async function getFavoriteProducts(
  userId: string,
): Promise<MicroCMSListResponse<Product>["contents"]> {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });

    const productIds = favorites.map((favorite) => favorite.productId);
    if (productIds.length === 0) {
      return [];
    }
    const products = await getProductsByIds(productIds);

    return products;
  } catch (error) {
    console.error("お気に入り商品の取得に失敗しました", error);
    throw new Error("お気に入り商品の取得に失敗しました");
  }
}

export async function removeFromFavorites(
  input: z.infer<typeof FavoriteInput>,
) {
  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session || !session.user) {
      throw new Error("認証が必要です");
    }

    const { productId } = FavoriteInput.parse(input);

    // お気に入りを削除
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    // /favoritesのキャッシュを再生成
    revalidatePath("/favorites");

    return { success: true };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // レコードが見つからない場合
      return { success: false, error: "NOT_FAVORITED" };
    }
    // その他のエラーの場合
    console.error("Failed to remove from favorites:", error);
    return { success: false, error: "UNKNOWN_ERROR" };
  }
}
