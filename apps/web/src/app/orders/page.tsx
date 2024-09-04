import { authOptions } from "@/app/libs/auth";
import { prisma } from "@/app/libs/prisma";
import { stripe } from "@/app/libs/stripe";
import { Session } from "@/types/session";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const OrdersPage = async () => {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "認証されていないか、メールアドレスが見つかりません。" },
      { status: 401 },
    );
  }

  // 購入履歴を取得
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { stripeCustomerId: true },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe顧客情報が見つかりません。" },
        { status: 404 },
      );
    }

    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 100,
    });
    const orders = paymentIntents.data.map((intent) => ({
      id: intent.id,
      amount: intent.amount,
      date: new Date(intent.created * 1000).toISOString(),
      status: intent.status,
    }));

    console.log("🤩orders", orders);

    return (
      <>
        {orders.map((order) => (
          <div key={order.id}>
            <p>注文日時: {order.date}</p>
            <p>金額: {order.amount} 円</p>
            <p>ステータス: {order.status}</p>
          </div>
        ))}
        <div>{/* <OrdersBody orders={orders} /> */}</div>
      </>
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div>
        <h1>エラーが発生しました</h1>
        <p>
          注文履歴の取得中にエラーが発生しました。後でもう一度お試しください。
        </p>
      </div>
    );
  }
};

export default OrdersPage;
