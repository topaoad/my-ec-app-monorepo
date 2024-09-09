import { authOptions } from "@/app/libs/auth";
import { prisma } from "@/app/libs/prisma";
import { stripe } from "@/app/libs/stripe";
import { CartItem } from "@/store/cartAtom";
import { Session } from "@/types/session";
import { createClient } from "microcms-js-sdk";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

async function checkAndReserveStock(item: CartItem) {
  const product = await client.get({
    endpoint: "products",
    contentId: item.id,
  });
  if (product.inventory - product.reservedInventory < item.quantity) {
    throw new Error(`商品:${item.title}は注文数が在庫を超えております `);
  }
  await client.update({
    endpoint: "products",
    contentId: item.id,
    content: {
      // 予約数は、microCMSの予約数に今回の注文数を加算する
      reservedInventory: product.reservedInventory + item.quantity,
    },
  });
  return true;
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const referer = request.headers.get("referer") || "http://localhost:3000";

  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const { cart } = await request.json();

  try {
    const session = (await getServerSession(authOptions)) as Session;
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    // ユーザーの Stripe カスタマーIDを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { stripeCustomerId: true, id: true },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: "ユーザー情報が見つかりません。" },
        { status: 404 },
      );
    }
    // cartにquantityが０の商品がある場合は除外
    const filteredCart = cart.filter(
      (item: { id: string; quantity: number; price: number; title: string }) =>
        item.quantity > 0,
    );
    console.log(filteredCart);

    // カート情報を最小限に絞る
    const minimalCart = filteredCart.map(
      (item: {
        id: string;
        quantity: number;
        price: number;
        title: string;
      }) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
      }),
    );
    // カート情報をJSONに変換
    const cartJson = JSON.stringify(minimalCart);
    // Webhookのためのmetadataオブジェクトを初期化
    const metadata: Record<string, string> = {
      user_id: user.id,
      email: session.user.email,
    };
    // 文字列を指定された長さで分割する補助関数
    const chunkString = (str: string, length: number): string[] => {
      const chunks = [];
      let i = 0;
      while (i < str.length) {
        chunks.push(str.slice(i, i + length));
        i += length;
      }
      return chunks;
    };

    // カートJSONが500文字を超える場合は分割する
    if (cartJson.length <= 500) {
      metadata.cart = cartJson;
    } else {
      const chunks = chunkString(cartJson, 500);
      chunks.forEach((chunk, index) => {
        metadata[`cart_${index}`] = chunk;
      });
    }

    // 在庫確認と予約
    for (const item of cart) {
      await checkAndReserveStock(item);
    }

    // Stripeセッションの作成
    const stripeSession = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: filteredCart.map(
        (item: {
          id: string;
          quantity: number;
          price: number;
          title: string;
          image?: { url: string };
        }) => ({
          price_data: {
            currency: "jpy",
            product_data: {
              name: item.title,
              images: [item.image?.url],
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        }),
      ),
      mode: "payment",
      // success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${origin}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: referer,
      metadata: metadata,
    });

    if (stripeSession.url) {
      return NextResponse.json({
        sessionId: stripeSession.id,
        url: stripeSession.url,
      });
    } else {
      throw new Error("Failed to create a new checkout session.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during checkout.",
      },
      { status: 500 },
    );
  }
}
