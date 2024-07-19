import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

const FavoriteInput = z.object({
  productId: z.string(),
});

export async function addToFavorites(input: z.infer<typeof FavoriteInput>) {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("認証が必要です");
  }

  const { productId } = FavoriteInput.parse(input);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "お気に入りの追加に失敗しました");
    }

    const result = await response.json();
    revalidatePath("/favorites");
    return result;
  } catch (error) {
    console.error("お気に入りの追加に失敗しました", error);
    throw error;
  }
}
