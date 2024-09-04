import { getProductById } from "@/app/libs/microcms";
import BackButton from "@/components/Button/BackButton";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    id: string;
  };
  searchParams: {
    draft_key?: string;
  };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const product = await getProductById(params.id).catch(() => null);
  const { title } = await parent;
  if (!product) {
    return {
      title,
    };
  }
  return {
    title: `${product.title} | ${title?.absolute}`,
  };
}

export default async function Product({
  params: { id: productId },
  searchParams,
}: PageProps) {
  let product = await getProductById(productId).catch(() => null);
  let draftKey: string | null = null;
  if (!product) {
    draftKey = searchParams?.draft_key || null;
    if (draftKey) {
      product = await getProductById(productId, {
        draftKey,
      }).catch(() => null);
    }
  }
  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    // カートに追加する処理をここに実装
    // 例: await addToCart(product.id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {product.image ? (
            <div className="relative w-full h-96">
              <Image
                src={product.image.url}
                alt={`Product image of ${product.title}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ) : null}
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold mb-4">
            {product.price.toLocaleString()}円
          </p>
          <p className="mb-4">
            在庫状況:{" "}
            {product.inventory > 0 ? `残り${product.inventory}点` : "在庫切れ"}
          </p>
          {/* <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.inventory > 0 ? 'カートに追加' : '在庫切れ'}
          </button> */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">商品説明</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <div className="mt-5">
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
}
