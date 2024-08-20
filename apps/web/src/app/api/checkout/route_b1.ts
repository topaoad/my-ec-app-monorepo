import { stripe } from "@/app/libs/stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const referer = request.headers.get("referer") || "http://localhost:3000";

  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const { cart, email } = await request.json();

  try {
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
      // 決済成功後の処理（在庫減少とmicroCMSへの情報送信）
      console.log("Session created:", session.id);
      console.log("決済成功！", cart);
      if (session.payment_status === "paid") {
        for (const item of cart) {
          // microCMSの在庫を減少
          await client.update({
            endpoint: "products",
            contentId: item.id,
            content: {
              inventory: item.inventory - item.quantity,
            },
          });

          // 決済情報をmicroCMSに送信（例：purchases エンドポイントがあると仮定）
          // await client.create({
          //   endpoint: "purchases",
          //   content: {
          //     productId: item.id,
          //     quantity: item.quantity,
          //     amount: item.price * item.quantity,
          //     purchaseDate: new Date().toISOString(),
          //     customerEmail: email,
          //   },
          // });
        }
      }

      return NextResponse.json({ sessionId: session.id, url: session.url });
    } else {
      throw new Error("Failed to create a new checkout session.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: "An error occurred during checkout." },
      { status: 500 },
    );
  }
}
