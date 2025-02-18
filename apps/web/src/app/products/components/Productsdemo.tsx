"use client";

// import { Pagination } from './layouts/Pagenation'wewew
import { MicroCMSImage, createClient } from "microcms-js-sdk";
import useSWR from "swr";

// クライアント側でuseSWRを使用してデータを取得
export function Productsdemo({ offset }: { offset?: number }) {
  const client = createClient({
    serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN!,
    apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY!,
  });

  type Product = {
    title: string;
    description?: string;
    image?: MicroCMSImage;
    price: number;
    inventory: number;
    day: string;
  };

  const fetchProducts = async (offset: number = 0): Promise<Product[]> => {
    const pageLimit = 4;
    const data = await client.getList<Product>({
      endpoint: "products",
      queries: {
        limit: pageLimit,
        offset: offset * pageLimit,
      },
    });
    return data.contents;
  };

  const {
    data: products,
    mutate,
    error: isError,
    isLoading,
  } = useSWR<Product[]>(["products", offset], () => fetchProducts(offset));

  return (
    // <Suspense fallback={<div>Loading中・・・</div>}>
    <>
      {/* <Pagination totalCount={totalCount} limit={limit} /> */}
      {/* </Suspense > */}
    </>
  );
}
