import { ITEMS_PER_PAGE } from "@/app/constants/orders";
import { listProducts } from "@/app/libs/microcms";
import CardFooterArea from "@/components/Card/CardFooter";
import CustomPagination from "@/components/CustomPagination";
import CartAtomCheck from "@/components/home/CartAtomCheck";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";

export const buttonVariants = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
    },
    size: {
      small: "btn-sm",
      large: "btn-lg",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "large",
  },
});

export async function Products({
  offset,
  success,
  currentPage,
}: {
  offset?: number;
  success?: boolean;
  currentPage: number;
}) {
  const { contents: products, ...args } = await listProducts();
  const { totalCount, limit } = args;
  // totalPagesを計算
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      {/* /<Suspense fallback={<div>Loading中・・・</div>}> */}
      {success && <CartAtomCheck success={success} />}
      <div className="">
        <h1 className="text-3xl font-bold text-center my-8 text-purple-800 dark:text-purple-300">
          商品一覧
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full">
              <Link
                className="flex flex-col h-full"
                href={`/products/${product.id}`}
                key={product.id}
              >
                <CardHeader className="p-0">
                  {product.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={product.image.url}
                        alt={`Product image of ${product.title}`}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="grow p-4">
                  <CardTitle className="text-xl mb-2">
                    {product.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      価格:{product.price.toLocaleString()} 円
                    </span>
                    <Badge variant="outline">残り {product.inventory} </Badge>
                  </div>
                </CardContent>
              </Link>
              <CardFooterArea product={product} />
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center my-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            href={"/"}
          />
        </div>
        {/* </Suspense > */}
      </div>
    </>
  );
}
