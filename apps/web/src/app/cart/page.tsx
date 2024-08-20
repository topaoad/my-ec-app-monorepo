import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/app/libs/microcms";
import CartBody from "../components/cart/CartBody";

const CartPage = async () => {
  const { contents: products } = await listProducts();

  return (
    <div>
      <CartBody products={products} />
    </div>
  );
};

export default CartPage;
