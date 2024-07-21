"use client";

import React, { FC, ReactNode } from "react";
import { cn } from "@repo/utils/twMerge";
import { cva } from "class-variance-authority";
import { Button } from "@mantine/core";
import { ShoppingCart, Heart, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/app/libs/microcms";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addToFavorites } from "@/app/libs/actions/favorites";


interface CardFooterAreaProps {
  product: Product;
}

const CardFooterArea: FC<CardFooterAreaProps> = ({
  product,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToFavorites = async (productId: string) => {
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
      const result = await addToFavorites({ productId });
      if (result.success) {
        toast({
          title: "お気に入りに追加しました",
          description: `${product.title} をお気に入りに追加しました`,
          duration: 2000,
        });
      } else if (result.error === "ALREADY_FAVORITED") {
        toast({
          title: "お気に入りに追加済みです",
          description: "この商品はすでに登録済みです",
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


  const handleAddToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // 商品IDがカート内に存在するかチェック
    const isAlreadyInCart = cart.includes(productId);

    if (!isAlreadyInCart) {
      cart.push(productId);
      localStorage.setItem("cart", JSON.stringify(cart));

      // ローカルストレージの変更イベントを発火
      window.dispatchEvent(new Event("storage"));
    }
    toast({
      title: isAlreadyInCart ? "既にカートに追加済みです" : "カートに追加しました",
      description: (
        <div className="flex items-center">
          {isAlreadyInCart ? (
            <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
          ) : (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          )}
          <span>
            {isAlreadyInCart
              ? `${product.title} は既にカートに入っています`
              : `${product.title} をカートに追加しました`}
          </span>
        </div>
      ),
      duration: 2000, // 2秒間表示
    });
  };

  return (
    <>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between gap-2 w-full">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(product.id);
            }}
            className=" px-2"
          >
            <ShoppingCart className=" h-4 w-4" />
            <span className="ml-1">
              カートに追加
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              handleAddToFavorites(product.id);
            }}
            className=" px-2"
          >
            <Heart className=" h-4 w-4" />
            <span className="ml-1">
              お気に入り
            </span>
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default CardFooterArea;
