"use client";

import React, { useState, useEffect, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, listProducts } from "@/app/libs/microcms";
import { MicroCMSContentId, MicroCMSDate, MicroCMSListResponse } from "microcms-js-sdk";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { removeFromFavorites } from "@/app/libs/actions/favorites";
import { Check, AlertCircle, Trash2, ShoppingCart } from "lucide-react";
import { useAddToFavorite } from "@/app/hooks/useAddToFavorite";
import { Badge } from "@/components/ui/badge";

interface FaviritesProps {
  favoriteProducts: MicroCMSListResponse<Product>["contents"];
}

const FaviritesBody: FC<FaviritesProps> = ({ favoriteProducts }) => {

  const [isLoading, setIsLoading] = useState(false);
  const { handleAddToFavorite } = useAddToFavorite();
  // おそらく状態管理はここでは入らない
  const [faviritesItems, setFaviritesItems] = useState<Product[]>([]);
  useEffect(() => {
    const fetchFaviritesItems = async () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const favoritesProducts = favoriteProducts.filter(favoriteProduct => favorites.includes(favoriteProduct.id));
      setFaviritesItems(favoritesProducts);
    };

    fetchFaviritesItems();
  }, []);

  interface FavoriteItemProps {
    productId: string;
    productTitle: string;
  }

  const handleRemoveFavorite = async ({ productId, productTitle }: FavoriteItemProps) => {
    setIsLoading(true);
    try {
      const result = await removeFromFavorites({ productId });
      if (result.success) {
        toast({
          title: "お気に入りから削除しました",
          description:
            (
              < div className="flex items-center" >
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span>
                  {productTitle} をお気に入りから削除しました。
                </span>
              </div >
            ),
          duration: 3000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("お気に入りの削除に失敗しました:", error);
      toast({
        title: "エラー",
        description:
          (
            < div className="flex items-center" >
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                お気に入りの削除に失敗しました。もう一度お試しください。
              </span>
            </div >
          ),
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">お気に入り</h1>
      {favoriteProducts.length === 0 ? (
        <p className="text-center">お気に入りは空です。</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favoriteProducts.map(item => (
              <Card key={item.id} className="flex flex-col h-full">
                <Link className="flex flex-col" href={`/products/${item.id}`} key={item.id}>
                  <CardHeader className="p-0">
                    {item.image && (
                      <div className="relative w-full h-48">
                        <Image
                          src={item.image.url}
                          alt={`Product image of ${item.title}`}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                  </CardHeader>
                </Link>
                <CardContent className="flex-grow p-4 ">
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      価格: {item.price.toLocaleString()}円
                    </p>
                    <Badge variant="outline">残り {item.inventory} </Badge>
                  </div>
                </CardContent>
                <div className="flex justify-between gap-2 w-full p-4 pt-0">
                  <Button variant="custom" className=""
                    // ここは
                    onClick={(e) => { e.preventDefault(); handleAddToFavorite(item); }}>
                    <ShoppingCart className=" h-4 w-4" />
                    <span className="ml-1">
                      カートに追加
                    </span>
                  </Button>
                  <Button variant="customReverse" className=""
                    onClick={(e) => { e.preventDefault(); handleRemoveFavorite({ productId: item.id, productTitle: item.title }); }}>
                    <Trash2 className=" h-4 w-4" />
                    <span className="ml-1">
                      削除
                    </span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
      }
    </div >
  );
};

export default FaviritesBody;