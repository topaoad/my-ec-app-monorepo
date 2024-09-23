import type {
  CustomRequestInit,
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSImage,
  MicroCMSListResponse,
  MicroCMSQueries,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import { cache } from "react";

// if (!process.env.MICROCMS_SERVICE_DOMAIN) {
//   throw new Error('MICROCMS_SERVICE_DOMAIN is required')
// }

// if (!process.env.MICROCMS_API_KEY) {
//   throw new Error('MICROCMS_API_KEY is required')
// }
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN as string,
  apiKey: process.env.MICROCMS_API_KEY as string,
});
const customRequestInit: CustomRequestInit | undefined = (() => {
  if (process.env.NODE_ENV === "development") {
    return {
      cache: "no-cache",
    };
  }
  if (process.env?.NEXT_RUNTIME === "edge") {
    return undefined;
  }
  return {
    cache: "default",
  };
})();

export type Product = {
  id: string;
  title: string;
  description?: string;
  // images?: Array<MicroCMSImage>
  image?: MicroCMSImage;
  price: number;
  inventory: number;
  day: string;
} & MicroCMSContentId &
  MicroCMSDate;

export const listProducts = cache(async (queries: MicroCMSQueries = {}) => {
  const pageLimit = 4;
  const offset = queries?.offset ? queries?.offset * pageLimit : 0;
  return client.getList<Product>({
    customRequestInit,
    endpoint: "products",
    queries: {
      limit: pageLimit,
      ...queries,
      offset,
    },
  });
});

export const getProductById = async (
  id: string,
  queries: MicroCMSQueries = {},
) => {
  return client.get<Product>({
    customRequestInit,
    endpoint: "products",
    contentId: id,
    queries,
  });
};

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const product = await client.get<Product>({
      endpoint: "products",
      contentId: productId,
    });
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await client.get<{ contents: Product[] }>({
      endpoint: "products",
    });
    return response.contents;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export type SiteInfo = {
  site_title: string;
  description: string;
  feature_image?: MicroCMSImage;
};

export async function getProductsByIds(
  ids: string[],
): Promise<MicroCMSListResponse<Product>["contents"]> {
  const response = await client.getList<Product>({
    endpoint: "products",
    queries: { ids: ids.join(",") },
  });

  return response.contents;
}

// export const getSiteInfo = async (): Promise<SiteInfo> => {
//   return client.get<SiteInfo>({
//     customRequestInit,
//     endpoint: 'site-info',
//   }).catch(e => {
//     return {
//       site_title: "Demo site data",
//       description: "Please update your microCMS data to set your site info"
//     }
//   })
// }
