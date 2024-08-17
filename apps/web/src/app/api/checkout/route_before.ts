import { stripe } from "@/app/libs/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { product_id: string } },
) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const referer = request.headers.get("referer") || "http://localhost:3000";
  const productId = params.product_id;
  if (
    request.headers.get("content-type") !== "application/x-www-form-urlencoded"
  ) {
    return NextResponse.json(
      {
        message: "Invalid request",
      },
      {
        status: 400,
      },
    );
  }
  const body = await request.formData();
  const amount = body.get("amount") as FormDataEntryValue;
  // const currency = body.get('currency') as FormDataEntryValue
  const currency = "jpy";
  // const name = body.get('name') as FormDataEntryValue
  const name = "testname";
  const image = body.get("image") as FormDataEntryValue;

  // 顧客のメールアドレスで顧客を検索し、あればそれを元に支払い方法を取得する。なければ新たな顧客を作成する。
  let paymentMethods;
  let customerId;

  // let customers = await stripe.customers.list({
  //   email: body.get("email") as string, // 顧客のメールアドレス
  // });
  // console.log("customers.datacustomers.data", customers.data)
  // if (customers.data.length > 0) {
  //   customerId = customers.data[0].id; // 最初に一致した顧客のIDを使用
  //   // 顧客のカード情報の取得
  //   paymentMethods = await stripe.paymentMethods.list({
  //     customer: customerId,
  //     type: "card",
  //   });
  // } else {
  //   const newCustomer = await stripe.customers.create({
  //     email: body.get("email") as string, // 顧客のメールアドレス
  //   });
  //   customerId = newCustomer.id;
  // }

  // 顧客のメールアドレスで顧客を検索
  let customers = await stripe.customers.list({
    email: body.get("email") as string,
  });

  // 顧客のリストをループし、支払い方法がある顧客を探す ※同じユーザーでも必ず決済をするとは限らないため
  for (let customer of customers.data) {
    const methods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });
    if (methods.data.length > 0) {
      // 支払い方法がある場合、その顧客IDを使用
      customerId = customer.id;
      paymentMethods = methods;
      break; // ループを抜ける
    }
  }

  // 支払い方法がある顧客が見つからなかった場合、新たな顧客を作成
  if (!customerId) {
    const newCustomer = await stripe.customers.create({
      email: body.get("email") as string,
    });
    customerId = newCustomer.id;
  }

  let { id: priceId } = await stripe.prices
    .list({
      product: productId,
    })
    .then(({ data }) => data[0])
    .catch((e) => ({ id: null }));
  if (!priceId) {
    const product = await stripe.products.create({
      id: productId,
      default_price_data: {
        unit_amount: Number(amount),
        currency: currency.toString(),
      },
      name: name.toString(),
      images: [image?.toString()],
    });
    priceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price?.id ?? "";
  }

  // 以下はStripe.jsやElementsを使用してクライアントサイドでカスタムした支払いを確認するために使用されます。
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: 1000, // 金額
  //   currency: 'jpy', // 通貨
  //   // customer: customer.id, // 顧客ID
  //   customer: paymentMethods?.data[0].customer as string, // 顧客ID
  //   payment_method: paymentMethods?.data[0].id,  // 支払い方法ID
  //   confirm: true, // 支払いの確認
  //   return_url: `${origin}?success=true`, // 支払い完了後のリダイレクトURL
  // });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    cancel_url: referer,
    success_url: `${origin}?success=true`,
    customer: customerId, // 顧客IDの指定
    payment_intent_data: {
      setup_future_usage: "on_session",
    },
  });
  if (session.url) {
    return NextResponse.redirect(new URL(session.url), 303);
  } else {
    return NextResponse.json(
      {
        message:
          "Failed to create a new checkout session. Please check your Stripe Dashboard.",
      },
      {
        status: 400,
      },
    );
  }
}
