import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "studyhub-auth" },
  ),
);

interface ThemeState {
  theme: "light" | "dark";
  toggle: () => void;
  init: () => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: "dark",
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
      localStorage.setItem("theme", next);
    }
    set({ theme: next });
  },
  init: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const theme = saved ?? "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    set({ theme });
  },
}));

export type ProductStatus = "pending" | "approved" | "rejected";

export interface Product {
  id: string;
  title: string;
  description: string;
  type: "book" | "exam" | "quiz";
  subject: string; // subject key
  country: string; // country code
  stage: string; // stage key
  price: number; // USD; 0 = free
  rating: number;
  badge?: "Hot" | "New" | "Best";
  image: string;
  author: string;
  status: ProductStatus;
  ownerId: string;
  ownerRole: Role;
  pages?: number;
  createdAt: number;
  /** Optional full body content (markdown / plain text). Falls back to SAMPLE_PARAGRAPHS. */
  content?: string;
}

interface CartState {
  items: Product[];
  purchased: string[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  purchase: () => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      purchased: [],
      add: (p) => {
        if (get().items.find((i) => i.id === p.id)) return;
        set({ items: [...get().items, p] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      purchase: () =>
        set({
          purchased: [...new Set([...get().purchased, ...get().items.map((i) => i.id)])],
          items: [],
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "studyhub-cart" },
  ),
);
