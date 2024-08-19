import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/store/cartAtom";
import { Product } from "@/app/libs/microcms";
import { MicroCMSListResponse } from "microcms-js-sdk";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: MicroCMSListResponse<Product>["contents"];
  totalAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, products, totalAmount }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, totalAmount }),
      });
      if (response.ok) {
        // 決済成功時の処理
        onClose();
        // ここで成功メッセージを表示したり、カートをクリアしたりします
      } else {
        // エラー処理
        console.error("Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>注文確認</DialogTitle>
        </DialogHeader>
        <div>
          {cart.map((item) => (
            <div key={item.id} className="mb-2">
              <span>{item.title}</span>
              <span className="ml-2">
                hogehoge
                {/* {item.price.toLocaleString()}円 × {item.quantity} */}
              </span>
            </div>
          ))}
          <p className="font-bold mt-4">
            合計: {totalAmount.toLocaleString()}円
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSubmit}>購入を確定する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};