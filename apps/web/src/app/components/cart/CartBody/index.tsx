"use client";

import React, { useState, useEffect, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/libs/microcms";
import { MicroCMSContentId, MicroCMSDate, MicroCMSListResponse } from "microcms-js-sdk";
import { cartAtom, updateCartQuantityAtom, removeFromCartAtom, CartItem } from "@/store/cartAtom";
import { useAtom, useAtomValue } from "jotai";
import { CheckoutModal } from "../../Modal/CheckoutModal";

interface CartBodyProps {
  products: MicroCMSListResponse<Product>["contents"];
}

const CartBody: FC<CartBodyProps> = ({ products }) => {
  const cart = useAtomValue(cartAtom);
  const [, updateCartQuantity] = useAtom(updateCartQuantityAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const cartItems: CartItem[] = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter((item): item is CartItem => item !== null);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartQuantity({ id, quantity });
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">買い物カート</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">カートは空です。</p>
      ) : (
        // <form action={`/api/${productId}/checkout`} method="POST">
        <div className="space-y-4">
          {cartItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>価格: {item.price.toLocaleString()}円</p>
                <div className="flex items-center mt-2">
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</Button>
                  <Button className="ml-4" onClick={() => handleRemoveFromCart(item.id)}>削除</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-right">
            <p className="text-xl font-bold">
              合計: {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}円
            </p>
            <Button variant="custom" size="lg" className="mt-4" onClick={handleCheckout}>
              購入する
            </Button>
            <CheckoutModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              cart={cart}
              products={products}
              totalAmount={totalAmount}
            />
          </div>
          {/* <input type="hidden" name="amount" value={product.price} />
            <input type="hidden" name="email" value="sample@gmail.com" /> */}
        </div>
        // </form>
      )
      }
    </div >
  );
};

export default CartBody;