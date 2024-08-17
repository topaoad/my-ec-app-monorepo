import { stripe } from "@/app/libs/stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "microcms-js-sdk";
import { CartItem } from "@/store/cartAtom";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

async function checkAndReserveStock(item: CartItem) {
  const product = await client.get({ endpoint: "products", contentId: item.id });
  if (product.inventory < item.quantity) {
    throw new Error(`商品:${item.title}は注文数が在庫を超えております `);
  }
  await client.update({
    endpoint: "products",
    contentId: item.id,
    content: {
      inventory: item.inventory - item.quantity,
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

  const { cart, email } = await request.json();

  try {
    // 在庫確認と予約
    for (const item of cart) {
      await checkAndReserveStock(item);
    }

    // Stripeセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item: any) => ({
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.title,
            images: [item.image?.url],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      // success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${origin}?success=true?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: referer,
      customer_email: email,
    });

    if (session.url) {
      return NextResponse.json({ sessionId: session.id, url: session.url });
    } else {
      throw new Error("Failed to create a new checkout session.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred during checkout." },
      { status: 500 }
    );
  }
}