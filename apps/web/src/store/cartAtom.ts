import type { Product } from "@/app/libs/microcms";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type CartItem = Product & {
  quantity: number;
};

// export const cartAtom = atom<CartItem[]>([]);
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

export const addToCartAtom = atom(null, (get, set, product: Product) => {
  const cart = get(cartAtom);
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    set(
      cartAtom,
      cart.map((item) =>
        item.id === product.id ? { ...item, quantity: 1 } : item,
      ),
    );
  } else {
    set(cartAtom, [...cart, { ...product, quantity: 1 }]);
  }
});

export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  const cart = get(cartAtom);
  set(
    cartAtom,
    cart.filter((item) => item.id !== productId),
  );
});

export const updateCartQuantityAtom = atom(
  null,
  (get, set, update: { id: string; quantity: number }) => {
    const cart = get(cartAtom);
    set(
      cartAtom,
      cart.map((item) =>
        item.id === update.id
          ? { ...item, quantity: Math.max(0, update.quantity) }
          : item,
      ),
    );
  },
);

// cartAtomを全て空にする
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, []);
});

// 無効な商品（microCMSに存在しない商品）をカートから削除
export const cleanupCartAtom = atom(
  null,
  (get, set, validProductIds: string[]) => {
    const cart = get(cartAtom);
    const validIdSet = new Set(validProductIds);
    const validCart = cart.filter((item) => validIdSet.has(item.id));
    if (validCart.length !== cart.length) {
      set(cartAtom, validCart);
    }
  },
);
