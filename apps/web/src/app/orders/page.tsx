import { ITEMS_PER_PAGE } from "@/app/constants/orders";
import { authOptions } from "@/app/libs/auth";
import { listProducts } from "@/app/libs/microcms";
import { prisma } from "@/app/libs/prisma";
import OrdersBody from "@/components/orders/OrdersBody";
import { Session } from "@/types/session";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// サーバーコンポーネントでクエリパラメータを受け取る
const OrdersPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const session = (await getServerSession(authOptions)) as Session;

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "認証されていないか、メールアドレスが見つかりません。" },
      { status: 401 },
    );
  }

  // 購入履歴を取得
  try {
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    // 注文総数を取得
    const totalOrders = await prisma.order.count({
      where: { user: { email: session.user.email } },
    });

    const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

    // ユーザーの注文履歴を取得
    const orders = await prisma.order.findMany({
      where: { user: { email: session.user.email } },
      include: { items: true, user: true },
      orderBy: { createdAt: "desc" },
      // 取得する注文の開始位置
      skip,
      // １回当たりに取得する注文数
      take: ITEMS_PER_PAGE,
    });

    const productIds = orders.flatMap((order) =>
      order.items.map((item) => item.productId),
    );
    const { contents: products } = await listProducts({
      ids: productIds.join(","),
    });
    // 商品情報をMapに変換
    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    return (
      <>
        <div>
          <OrdersBody
            orders={orders}
            productMap={productMap}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
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
