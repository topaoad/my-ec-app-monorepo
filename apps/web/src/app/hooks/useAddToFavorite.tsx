"use client";

import { toast, useToast } from "@/components/ui/use-toast";
import { Product } from "../libs/microcms";
import router from "next/router";
import { addToFavorites } from "../libs/actions/favorites";
import { useSession } from "next-auth/react";
import { Check, AlertCircle } from "lucide-react";

export const useAddToFavorite = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleAddToFavorite = async (product: Product) => {
    if (!session) {
      toast({
        title: "ログインが必要です",
        description: "お気に入りに追加するにはログインしてください。",
        duration: 2000,
      });
      router.push("/signin");
      return;
    }

    try {
      const result = await addToFavorites({ productId: product.id });

      if (result.success) {
        toast({
          title: "お気に入りに追加しました",
          description: (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-green-500" />
              <span>{product.title} をお気に入りに追加しました</span>
            </div>
          ),
          duration: 2000,
        });
      } else if (result.error === "ALREADY_FAVORITED") {
        toast({
          title: "お気に入りに追加済みです",
          description: (
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              <span>この商品はすでにお気に入りに登録済みです</span>
            </div>
          ),
          duration: 2000,
        });
      } else {
        throw new Error("Failed to add to favorites");
      }
    } catch (error) {
      console.error("お気に入りの追加に失敗しました", error);
      toast({
        title: "エラー",
        description: "お気に入りの追加に失敗しました。もう一度お試しください。",
        duration: 2000,
      });
    }
  };

  return { handleAddToFavorite };
};
