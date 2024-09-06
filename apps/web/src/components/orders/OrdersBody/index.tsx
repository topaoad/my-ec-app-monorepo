"use client";

import { useAddToCart } from "@/app/hooks/useAddToCart";
import { Product } from "@/app/libs/microcms";
import CustomPagination from "@/components/CustomPagination";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CustomOrderWithRelations } from "@/types/orders";
import { Button, Card } from "@mantine/core";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface OrdersProps {
  orders: CustomOrderWithRelations[];
  productMap: Map<string, Product>;
  currentPage: number;
  totalPages: number;
}

const OrdersBody: FC<OrdersProps> = (props) => {
  const { orders, productMap, currentPage, totalPages } = props;
  const { handleAddToCart } = useAddToCart();
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">
        注文履歴
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>
                注文日: {new Date(order.createdAt).toLocaleDateString()}
              </CardTitle>
              <p>総額: {order.totalAmount.toLocaleString()} 円</p>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => {
                const product = productMap.get(item.productId) as Product;
                return product ? (
                  <div key={item.id} className="mb-5">
                    <Link href={`/products/${item.productId}`} key={item.id}>
                      {product.image && (
                        <div className="relative w-full h-32 mb-2">
                          <Image
                            src={product.image.url}
                            alt={`Product image of ${product.title}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <p className="font-semibold">{product.title}</p>
                      <p>数量: {item.quantity}</p>
                      <p>価格: {item.price.toLocaleString()} 円</p>
                    </Link>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className=" px-2"
                    >
                      <ShoppingCart className=" h-4 w-4" />
                      <span className="ml-1">再購入</span>
                    </Button>
                  </div>
                ) : null;
              })}
            </CardContent>
          </Card>
        ))}
      </div>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        href={"/orders"}
      />
    </div>
  );
};

export default OrdersBody;
