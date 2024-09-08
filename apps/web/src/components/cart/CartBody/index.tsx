"use client";

import { Product } from "@/app/libs/microcms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cartAtom,
  CartItem,
  removeFromCartAtom,
  updateCartQuantityAtom,
} from "@/store/cartAtom";
import { useAtom, useAtomValue } from "jotai";
import { MicroCMSListResponse } from "microcms-js-sdk";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { CheckoutModalV2 } from "../../Modal/CheckoutModalV2";
interface CartBodyProps {
  products: MicroCMSListResponse<Product>["contents"];
}

const CartBody: FC<CartBodyProps> = ({ products }) => {
  const [isClient, setIsClient] = useState(false);
  const cart = useAtomValue(cartAtom);
  const [, updateCartQuantity] = useAtom(updateCartQuantityAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartItems: CartItem[] = useMemo(() => {
    if (!isClient) {
      return [];
    }
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart, products, isClient]);

  // 購入するボタン用に、cartItemsはquantityが０より大きいものだけに絞り込む
  const filteredCartItems = useMemo(
    () => cartItems.filter((item) => item.quantity > 0),
    [cartItems],
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartQuantity({ id, quantity });
  };

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (!session && status !== "loading") {
      const currentPath = pathname;
      router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
    setIsModalOpen(true);
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">
        買い物カート
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center">カートは空です。</p>
      ) : (
        // <form action={`/api/${productId}/checkout`} method="POST">
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto space-y-3">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col sm:flex-row overflow-hidden"
              >
                <div className="w-full sm:w-1/3 relative h-48 sm:h-auto">
                  <Link
                    className="flex flex-col h-full"
                    href={`/products/${item.id}`}
                    key={item.id}
                  >
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
                </div>
                <CardContent className="flex-1 p-4 sm:ml-5">
                  <CardTitle>{item.title}</CardTitle>
                  <p className="sm:mt-5">
                    価格: {item.price.toLocaleString()}円
                  </p>
                  <div className="flex items-center mt-2 sm:mt-5">
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    <Button
                      className="ml-4"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      削除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">
              合計: {totalAmount.toLocaleString()}円
            </p>
            {/* 購入するボタンはtotalAmountが０の時はdisabledにする */}
            <Button
              variant="custom"
              size="lg"
              className="mt-4"
              onClick={handleCheckout}
              disabled={totalAmount === 0}
            >
              購入する
            </Button>
            <CheckoutModalV2
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              cart={filteredCartItems}
              products={products}
              totalAmount={totalAmount}
              email={session?.user?.email ?? ""}
            />
          </div>
          {/* <input type="hidden" name="amount" value={product.price} />
            <input type="hidden" name="email" value="sample@gmail.com" /> */}
        </div>
        // </form>
      )}
    </div>
  );
};

export default CartBody;
