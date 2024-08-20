import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, listProducts } from "@/app/libs/microcms";
import FavoritesBody from "../components/favorites/FavoritesBody";
import { getFavoriteProducts } from "../libs/actions/favorites";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../libs/auth";
import { MicroCMSListResponse } from "microcms-js-sdk";
import { Session } from "@/types/session";

const FavoritesPage = async () => {
  const session = (await getServerSession(authOptions)) as Session;

  let favoriteProducts: MicroCMSListResponse<Product>["contents"] = [];
  if (session && session.user && session.user.id) {
    favoriteProducts = await getFavoriteProducts(session.user.id);
  } else {
    console.log("User session is missing or invalid.");
  }

  return (
    <div>
      <FavoritesBody favoriteProducts={favoriteProducts} />
    </div>
  );
};

export default FavoritesPage;
