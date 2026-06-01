import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductStatus, Role } from "./store";
import { PRODUCTS as SEED, SUBJECT_IMAGES } from "./data";

export interface NewProductInput {
  title: string;
  description: string;
  type: Product["type"];
  subject: string;
  country: string;
  stage: string;
  price: number;
  author: string;
  image?: string;
  pages?: number;
  content?: string;
  ownerId: string;
  ownerRole: Role;
}

interface ProductsState {
  items: Product[];
  /** Submit a new resource. Admin → approved instantly, others → pending. */
  submit: (p: NewProductInput) => Product;
  remove: (id: string) => void;
  setStatus: (id: string, status: ProductStatus) => void;
  setUnlocked: (id: string, unlocked: boolean) => void;
  setCommission: (id: string, percent: number | undefined) => void;
  reset: () => void;
}

export const useProducts = create<ProductsState>()(
  persist(
    (set, get) => ({
      items: SEED,
      submit: (p) => {
        const id = `c${Date.now()}`;
        const product: Product = {
          id,
          title: p.title,
          description: p.description,
          type: p.type,
          subject: p.subject,
          country: p.country,
          stage: p.stage,
          price: p.price,
          author: p.author,
          image: p.image || SUBJECT_IMAGES[p.subject] || SEED[0].image,
          rating: 5.0,
          badge: "New",
          status: p.ownerRole === "admin" ? "approved" : "pending",
          ownerId: p.ownerId,
          ownerRole: p.ownerRole,
          pages: p.pages,
          content: p.content,
          createdAt: Date.now(),
        };
        set({ items: [product, ...get().items] });
        return product;
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setStatus: (id, status) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, status } : i)),
        }),
      setUnlocked: (id, unlocked) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, unlocked } : i)),
        }),
      setCommission: (id, percent) =>
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, commissionPercent: percent === undefined ? undefined : Math.max(0, Math.min(90, percent)) }
              : i,
          ),
        }),
      reset: () => set({ items: SEED }),
    }),
    {
      name: "studyhub-products-v2",
      // bump key so old shape (without status) is replaced
      version: 2,
    },
  ),
);

/** Selector helpers */
export function selectApproved(items: Product[]): Product[] {
  return items.filter((i) => i.status === "approved");
}
export function selectPending(items: Product[]): Product[] {
  return items.filter((i) => i.status === "pending");
}
