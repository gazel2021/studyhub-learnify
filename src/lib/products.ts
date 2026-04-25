import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./store";
import { PRODUCTS as SEED } from "./data";

interface ProductsState {
  items: Product[];
  add: (p: Omit<Product, "id" | "rating">) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useProducts = create<ProductsState>()(
  persist(
    (set, get) => ({
      items: SEED,
      add: (p) => {
        const id = `c${Date.now()}`;
        const product: Product = {
          ...p,
          id,
          rating: 5.0,
          badge: "New",
        };
        set({ items: [product, ...get().items] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      reset: () => set({ items: SEED }),
    }),
    { name: "studyhub-products" },
  ),
);
