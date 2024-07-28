"use client";

import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check } from "lucide-react";
import { Product } from "../libs/microcms";
import { cartAtom, addToCartAtom } from "@/store/cartAtom";
import { useAtom, useAtomValue } from "jotai";

export const useAddToCart = () => {
  const { toast } = useToast();
  const cart = useAtomValue(cartAtom);
  const [, addToCart] = useAtom(addToCartAtom);

  const handleAddToCart = (product: Product) => {
    const isAlreadyInCart = cart.some(item => item.id === product.id);

    if (!isAlreadyInCart) {
      addToCart(product);
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
      duration: 2000,
    });
  };

  return { handleAddToCart };
};