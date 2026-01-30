import { Skeleton } from "@mantine/core";

/**
 * ページローディング用のスケルトンコンポーネント
 */
export function PageLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <Skeleton height={32} width="40%" radius="md" />
      <Skeleton height={200} radius="md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton height={150} radius="md" />
        <Skeleton height={150} radius="md" />
        <Skeleton height={150} radius="md" />
      </div>
    </div>
  );
}

/**
 * 商品グリッド用のスケルトン
 */
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`product-skeleton-${i}`} className="space-y-2">
          <Skeleton height={200} radius="md" />
          <Skeleton height={16} width="70%" radius="sm" />
          <Skeleton height={20} width="40%" radius="sm" />
        </div>
      ))}
    </div>
  );
}

/**
 * 商品詳細用のスケルトン
 */
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      <Skeleton height={400} radius="md" />
      <div className="space-y-4">
        <Skeleton height={32} width="80%" radius="md" />
        <Skeleton height={24} width="30%" radius="md" />
        <Skeleton height={100} radius="md" />
        <Skeleton height={48} width="50%" radius="md" />
      </div>
    </div>
  );
}

/**
 * カート・お気に入りリスト用のスケルトン（横長カード形式）
 */
export function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <Skeleton height={36} width="30%" radius="md" className="mx-auto my-8" />
      <div className="space-y-3 h-[400px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`cart-skeleton-${i}`}
            className="flex flex-col sm:flex-row overflow-hidden border rounded-lg"
          >
            <Skeleton height={192} className="w-full sm:w-1/3" radius="none" />
            <div className="flex-1 p-4 space-y-3">
              <Skeleton height={24} width="60%" radius="sm" />
              <Skeleton height={20} width="30%" radius="sm" />
              <div className="flex gap-2 mt-4">
                <Skeleton height={36} width={36} radius="sm" />
                <Skeleton height={36} width={40} radius="sm" />
                <Skeleton height={36} width={36} radius="sm" />
                <Skeleton height={36} width={60} radius="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right mt-4 space-y-2">
        <Skeleton height={28} width={150} radius="sm" className="ml-auto" />
        <Skeleton height={44} width={120} radius="md" className="ml-auto" />
      </div>
    </div>
  );
}

/**
 * 購入履歴用のスケルトン（グリッドカード形式）
 */
export function OrdersSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <Skeleton height={36} width="30%" radius="md" className="mx-auto my-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`order-skeleton-${i}`}
            className="border rounded-lg p-4 space-y-3"
          >
            <Skeleton height={24} width="70%" radius="sm" />
            <Skeleton height={20} width="40%" radius="sm" />
            <div className="space-y-3 mt-4">
              <Skeleton height={128} radius="sm" />
              <Skeleton height={18} width="50%" radius="sm" />
              <Skeleton height={16} width="30%" radius="sm" />
              <Skeleton height={16} width="35%" radius="sm" />
              <Skeleton height={32} width={100} radius="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * リスト用のスケルトン（汎用）
 */
export function ListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton height={32} width="30%" radius="md" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`list-skeleton-${i}`} className="flex gap-4 items-center">
          <Skeleton height={80} width={80} radius="md" />
          <div className="flex-1 space-y-2">
            <Skeleton height={20} width="60%" radius="sm" />
            <Skeleton height={16} width="40%" radius="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * フォーム用のスケルトン
 */
export function FormSkeleton() {
  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      <Skeleton height={32} width="50%" radius="md" />
      <div className="space-y-4">
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
        <Skeleton height={40} radius="md" />
        <Skeleton height={48} radius="md" />
      </div>
    </div>
  );
}

/**
 * お気に入りページ用のスケルトン（3列グリッドカード形式）
 * FavoritesBodyコンポーネントのレイアウトに合わせた設計
 */
export function FavoritesSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <Skeleton height={36} width="30%" radius="md" className="mx-auto my-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`favorites-skeleton-${i}`}
            className="flex flex-col border rounded-lg overflow-hidden"
          >
            {/* 画像エリア */}
            <Skeleton height={192} radius="none" />
            {/* コンテンツエリア */}
            <div className="p-4 space-y-3 flex-1">
              <Skeleton height={24} width="80%" radius="sm" />
              <Skeleton height={16} width="100%" radius="sm" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton height={20} width="40%" radius="sm" />
                <Skeleton height={20} width={60} radius="sm" />
              </div>
            </div>
            {/* ボタンエリア */}
            <div className="flex gap-2 p-4 pt-0">
              <Skeleton height={36} className="flex-1" radius="sm" />
              <Skeleton height={36} className="flex-1" radius="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * サインインページ用のスケルトン
 * SessionTipコンポーネントのレイアウト（フルスクリーン中央配置）に合わせた設計
 */
export function SignInSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-md space-y-6">
        {/* タイトル */}
        <Skeleton height={32} width="40%" radius="md" className="mx-auto" />
        {/* 説明テキスト */}
        <Skeleton height={20} width="80%" radius="sm" className="mx-auto" />
        {/* Googleログインボタン */}
        <Skeleton height={48} radius="lg" />
        {/* 区切り線 */}
        <div className="relative my-6">
          <Skeleton height={1} radius="none" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
            <Skeleton height={16} width={40} radius="sm" />
          </div>
        </div>
        {/* 他の方法でログインボタン */}
        <Skeleton height={48} radius="lg" />
      </div>
    </div>
  );
}
