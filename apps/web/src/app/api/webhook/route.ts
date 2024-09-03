import { prisma } from "@/app/libs/prisma";
import { stripe } from "@/app/libs/stripe";
import { Prisma } from "@prisma/client";
import fs from "fs";
import { createClient } from "microcms-js-sdk";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import Stripe from "stripe";

// webhook.logで変数を出力するための関数
const logToFile = (message: string) => {
  const logPath = path.join(process.cwd(), "webhook.log");
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      // logToFile(`Webhook verifiedしたよ: ${event.type}`);
    } catch (err: any) {
      // logToFile(`Webhook Error: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }
    const session = event.data.object as Stripe.Checkout.Session;
    const cartItems = JSON.parse(session.metadata?.cart || "[]");
    // 【すべてのイベントタイプを確認】
    switch (event.type) {
    // 決済が完了したときのイベント
    case "checkout.session.completed":
      // logToFile("Processing checkout.session.completed event");
      await handleCheckoutSessionCompleted(session);

      // logToFile(`session: ${JSON.stringify(session)}`);
      // logToFile(`Sending email to: ${session.metadata?.email}`);
      // logToFile(`Cart items: ${JSON.stringify(cartItems)}`);
      // logToFile(`Total amount: ${session.amount_total}`);
      // Resendを使ってメールを送信
      const internalResponse = await fetch(
        `${process.env.BASE_URL}/api/checkout-complete-mail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Call": "true", // 内部呼び出しを識別するためのヘッダー
          },
          body: JSON.stringify({
            email: session.metadata?.email,
            cart: cartItems,
            totalAmount: session.amount_total,
          }),
        },
      );

      // レスポンスの詳細を常にログに記録
      const responseText = await internalResponse.text();
      // logToFile(`Internal response status: ${internalResponse.status}`);
      // logToFile(`Internal response body: ${responseText}`);

      if (!internalResponse.ok) {
        // logToFile(
        //   `Failed to send checkout complete mail: ${await internalResponse.text()}`,
        // );
      }
      break;
    case "charge.succeeded":
      // logToFile("Received charge.succeeded event");
      break;
    case "payment_intent.succeeded":
      // logToFile("Received payment_intent.succeeded event");
      break;
    case "payment_intent.created":
      // logToFile("Received payment_intent.created event");
      break;
    default:
      // logToFile(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // logToFile(
    //   `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    // );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  // logToFile(`Processing session: ${session.id}`);
  // console.log(session.metadata?.email)
  const cartItems = JSON.parse(session.metadata?.cart || "[]");
  // logToFile(`Cart items: ${JSON.stringify(cartItems)}`);
  // logToFile(`session: ${JSON.stringify(session)}`);

  try {
    // 重複確認のため、すでに登録されている注文を取得
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existingOrder) {
      // logToFile(`Order already exists for session: ${session.id}`);
      return;
    }

    // 注文情報をデータベースに保存
    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        userId: session.metadata?.user_id!,
        totalAmount: session.amount_total!,
        status: "completed",
        items: {
          create: cartItems.map(
            (item: { id: string; quantity: number; price: number }) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            }),
          ),
        },
      },
    });
    // logToFile(`Order created: ${order.id}`);

    // microCMSの在庫を更新
    for (const item of cartItems) {
      const product = await client.get({
        endpoint: "products",
        contentId: item.id,
      });
      await client.update({
        endpoint: "products",
        contentId: item.id,
        content: {
          inventory: product.inventory - item.quantity,
          reservedInventory: product.reservedInventory - item.quantity,
        },
      });
      // logToFile(`Updated inventory for product: ${item.id}`);
    }
  } catch (error) {
    console.error("Error processing checkout session:", error);
    // logToFile(
    //   `Error creating order: ${error instanceof Error ? error.message : String(error)}`,
    // );
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // logToFile(`Prisma error code: ${error.code}`);
      // logToFile(`Prisma error message: ${error.message}`);
    }
  }
}
