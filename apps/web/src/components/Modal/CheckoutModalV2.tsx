import { Product } from "@/app/libs/microcms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CartItem } from "@/store/cartAtom";
import { MicroCMSListResponse } from "microcms-js-sdk";
import React, { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: MicroCMSListResponse<Product>["contents"];
  totalAmount: number;
  email: string;
}
export const CheckoutModalV2: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  totalAmount,
  email,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "決済処理に失敗しました。");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "決済処理中にエラーが発生しました。",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>注文確認</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            {cart.map((item) => (
              <div key={item.id} className="mb-2">
                <span>{item.title}</span>
                <span className="ml-2">
                  {item.price.toLocaleString()}円 × {item.quantity}
                </span>
              </div>
            ))}
            <p className="font-bold mt-4">
              合計: {totalAmount.toLocaleString()}円
            </p>
          </div>
          <input
            type="hidden"
            id="email"
            name="email"
            value={email}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-300 focus:ring-3 focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
          />
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <DialogFooter className="mt-6">
            <Button type="button" onClick={onClose} disabled={isProcessing}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? "処理中..." : "決済に進む"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
