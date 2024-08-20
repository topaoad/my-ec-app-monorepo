"use client";

import React, { FC } from "react";
import { Button } from "@mantine/core";
import { ShoppingCart, Heart } from "lucide-react";
import {
  CardFooter,
} from "@/components/ui/card";
import { Product } from "@/app/libs/microcms";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/app/hooks/useAddToCart";
import { useAddToFavorite } from "@/app/hooks/useAddToFavorite";

interface CardFooterAreaProps {
  product: Product;
}

const CardFooterArea: FC<CardFooterAreaProps> = ({ product }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const { handleAddToCart } = useAddToCart();
  const { handleAddToFavorite } = useAddToFavorite();

  return (
    <>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between gap-2 w-full">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(product);
            }}
            className=" px-2"
          >
            <ShoppingCart className=" h-4 w-4" />
            <span className="ml-1">カートに追加</span>
          </Button>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              handleAddToFavorite(product);
            }}
            className=" px-2"
          >
            <Heart className=" h-4 w-4" />
            <span className="ml-1">お気に入り</span>
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default CardFooterArea;
