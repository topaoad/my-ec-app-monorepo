"use client";

import { clearCartAtom } from "@/store/cartAtom";
import { useAtom } from "jotai";
import { FC, useEffect } from "react";

interface CartAtomCheckProps {
  success: boolean;
}

const CartAtomCheck: FC<CartAtomCheckProps> = ({ success }) => {
  const [, clearCart] = useAtom(clearCartAtom);

  useEffect(() => {
    //  もしsuccessがtrueなら、カートを空にする
    if (success) {
      handleRemoveAllFromCart();
    }
  }, []);

  const handleRemoveAllFromCart = () => {
    clearCart();
  };

  return <div></div>;
};

export default CartAtomCheck;
