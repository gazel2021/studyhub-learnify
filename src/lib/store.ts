import { create } from "zustand";

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

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

interface ThemeState {
  theme: "light" | "dark";
  toggle: () => void;
  init: () => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: "light",
  toggle: () => {
    const next = get().theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    }
    set({ theme: next });
  },
  init: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved ?? (prefers ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
}));

export interface Product {
  id: string;
  title: string;
  description: string;
  type: "book" | "exam" | "quiz";
  subject: string;
  country: string;
  stage: string;
  price: number; // 0 = free
  rating: number;
  badge?: "Hot" | "New" | "Best";
  image: string;
  author: string;
}

interface CartState {
  items: Product[];
  purchased: string[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  purchase: () => void;
  clear: () => void;
}

export const useCart = create<CartState>((set, get) => ({
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
}));
