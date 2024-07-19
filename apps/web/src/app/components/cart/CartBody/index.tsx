"use client";

import React, { useState, useEffect, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, listProducts } from "@/app/libs/microcms";
import { MicroCMSContentId, MicroCMSDate, MicroCMSListResponse } from "microcms-js-sdk";

interface CartBodyProps {
  products: MicroCMSListResponse<Product>["contents"];
}

type CartItem = Product & MicroCMSContentId & MicroCMSDate;

const CartBody: FC<CartBodyProps> = ({ products }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cartProducts = products.filter(product => cart.includes(product.id));
      setCartItems(cartProducts);
    };

    fetchCartItems();
  }, []);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">買い物カート</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">カートは空です。</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>価格: {item.price.toLocaleString()}円</p>
                {/* ここに数量変更や削除機能を追加できます */}
              </CardContent>
            </Card>
          ))}
          <div className="text-right">
            <p className="text-xl font-bold">
              合計: {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}円
            </p>
            <Button variant="default" size="lg" className="mt-4">
              チェックアウト
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartBody;