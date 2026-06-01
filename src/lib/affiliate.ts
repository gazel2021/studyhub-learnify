import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AffiliateAppStatus = "pending" | "approved" | "rejected";
export type WithdrawStatus = "pending" | "paid" | "rejected";

export interface AffiliateApp {
  userId: string;
  userName: string;
  userEmail: string;
  status: AffiliateAppStatus;
  /** Unique referral code (after approval). */
  code: string;
  /** Optional pitch from the marketer. */
  note?: string;
  createdAt: number;
  reviewedAt?: number;
}

export interface AffiliateSale {
  id: string;
  affiliateUserId: string;
  productId: string;
  productTitle: string;
  amountUsd: number;
  commissionUsd: number;
  commissionPercent: number;
  createdAt: number;
}

export interface WithdrawRequest {
  id: string;
  affiliateUserId: string;
  amountUsd: number;
  method: string; // e.g. PayPal email, Pi username, bank...
  details: string;
  status: WithdrawStatus;
  requestedAt: number;
  resolvedAt?: number;
  adminNote?: string;
}

interface AffiliateState {
  apps: AffiliateApp[];
  sales: AffiliateSale[];
  withdrawals: WithdrawRequest[];
  /** Default commission % used when a product has none set. */
  defaultPercent: number;
  setDefaultPercent: (p: number) => void;

  /** Apply to be an affiliate (creates a pending app). */
  apply: (u: { id: string; name: string; email: string; note?: string }) => {
    ok?: boolean;
    error?: string;
  };
  approveApp: (userId: string) => void;
  rejectApp: (userId: string) => void;
  getApp: (userId: string) => AffiliateApp | undefined;
  getByCode: (code: string) => AffiliateApp | undefined;

  /** Record a sale (called on successful checkout). */
  recordSale: (s: Omit<AffiliateSale, "id" | "createdAt">) => void;

  requestWithdraw: (data: Omit<WithdrawRequest, "id" | "status" | "requestedAt" | "resolvedAt">) => {
    ok?: boolean;
    error?: string;
  };
  markPaid: (id: string, note?: string) => void;
  rejectWithdraw: (id: string, note?: string) => void;

  /** Available balance = approved sales − (paid + pending withdrawals). */
  balanceFor: (userId: string) => { earned: number; pending: number; paid: number; available: number };
}

function genCode(name: string): string {
  const base = (name || "ref").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase() || "REF";
  const suf = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suf}`;
}

export const useAffiliate = create<AffiliateState>()(
  persist(
    (set, get) => ({
      apps: [],
      sales: [],
      withdrawals: [],
      defaultPercent: 20,

      setDefaultPercent: (p) => set({ defaultPercent: Math.max(0, Math.min(90, p)) }),

      apply: ({ id, name, email, note }) => {
        const existing = get().apps.find((a) => a.userId === id);
        if (existing) return { error: "ALREADY_APPLIED" };
        const app: AffiliateApp = {
          userId: id,
          userName: name,
          userEmail: email,
          status: "pending",
          code: genCode(name),
          note,
          createdAt: Date.now(),
        };
        set({ apps: [app, ...get().apps] });
        return { ok: true };
      },

      approveApp: (userId) =>
        set({
          apps: get().apps.map((a) =>
            a.userId === userId ? { ...a, status: "approved", reviewedAt: Date.now() } : a,
          ),
        }),

      rejectApp: (userId) =>
        set({
          apps: get().apps.map((a) =>
            a.userId === userId ? { ...a, status: "rejected", reviewedAt: Date.now() } : a,
          ),
        }),

      getApp: (userId) => get().apps.find((a) => a.userId === userId),
      getByCode: (code) =>
        get().apps.find((a) => a.code.toLowerCase() === code.toLowerCase() && a.status === "approved"),

      recordSale: (s) => {
        const sale: AffiliateSale = {
          ...s,
          id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          createdAt: Date.now(),
        };
        set({ sales: [sale, ...get().sales] });
      },

      requestWithdraw: ({ affiliateUserId, amountUsd, method, details }) => {
        if (amountUsd <= 0) return { error: "BAD_AMOUNT" };
        const bal = get().balanceFor(affiliateUserId);
        if (amountUsd > bal.available) return { error: "INSUFFICIENT" };
        if (!method.trim() || !details.trim()) return { error: "MISSING_DETAILS" };
        const w: WithdrawRequest = {
          id: `w_${Date.now()}`,
          affiliateUserId,
          amountUsd,
          method,
          details,
          status: "pending",
          requestedAt: Date.now(),
        };
        set({ withdrawals: [w, ...get().withdrawals] });
        return { ok: true };
      },

      markPaid: (id, note) =>
        set({
          withdrawals: get().withdrawals.map((w) =>
            w.id === id ? { ...w, status: "paid", resolvedAt: Date.now(), adminNote: note } : w,
          ),
        }),

      rejectWithdraw: (id, note) =>
        set({
          withdrawals: get().withdrawals.map((w) =>
            w.id === id ? { ...w, status: "rejected", resolvedAt: Date.now(), adminNote: note } : w,
          ),
        }),

      balanceFor: (userId) => {
        const earned = get().sales
          .filter((s) => s.affiliateUserId === userId)
          .reduce((sum, s) => sum + s.commissionUsd, 0);
        const pending = get().withdrawals
          .filter((w) => w.affiliateUserId === userId && w.status === "pending")
          .reduce((sum, w) => sum + w.amountUsd, 0);
        const paid = get().withdrawals
          .filter((w) => w.affiliateUserId === userId && w.status === "paid")
          .reduce((sum, w) => sum + w.amountUsd, 0);
        return {
          earned,
          pending,
          paid,
          available: Math.max(0, earned - pending - paid),
        };
      },
    }),
    { name: "studyhub-affiliate-v1" },
  ),
);

/** Storage key for the active referral code captured from ?ref= URL param. */
const REF_KEY = "studyhub-affiliate-ref";
const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function captureRef(code: string) {
  if (typeof window === "undefined" || !code) return;
  try {
    localStorage.setItem(REF_KEY, JSON.stringify({ code, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function getActiveRef(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REF_KEY);
    if (!raw) return null;
    const { code, ts } = JSON.parse(raw) as { code: string; ts: number };
    if (Date.now() - ts > REF_TTL_MS) {
      localStorage.removeItem(REF_KEY);
      return null;
    }
    return code || null;
  } catch {
    return null;
  }
}

export function clearRef() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REF_KEY);
  } catch {
    /* ignore */
  }
}
