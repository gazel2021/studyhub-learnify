import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./store";

/** Granular permissions an admin (other than the root owner) can be granted. */
export type Permission =
  | "approve_content"
  | "manage_users"
  | "edit_pages"
  | "manage_taxonomy"
  | "view_code"
  | "manage_settings";

export const ALL_PERMISSIONS: Permission[] = [
  "approve_content",
  "manage_users",
  "edit_pages",
  "manage_taxonomy",
  "view_code",
  "manage_settings",
];

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  /** Plain-text password (LOCAL DEMO ONLY — never use in real apps). */
  password: string;
  role: Role;
  /** Profile picture (data URL or http URL). */
  avatar?: string;
  bio?: string;
  phone?: string;
  country?: string;
  /** Granted permissions (only meaningful for admins). */
  permissions: Permission[];
  /** True after the user verified their email via OTP. */
  emailVerified: boolean;
  createdAt: number;
  /** Soft-disable from the admin panel. */
  disabled?: boolean;
  /** Marks the original/root admin (the app owner) — has all permissions. */
  isOwner?: boolean;
}

interface OtpRecord {
  code: string;
  expiresAt: number;
  /** Pending data attached to the OTP (signup payload). */
  pending?: Omit<UserAccount, "emailVerified" | "createdAt" | "permissions"> & {
    permissions?: Permission[];
  };
  purpose: "signup" | "login" | "reset";
}

interface UsersState {
  users: UserAccount[];
  otps: Record<string, OtpRecord>; // keyed by email
  /** Issue an OTP for a new account (sign-up). Returns the code so the UI can show it. */
  startSignup: (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => { code: string; error?: string };
  /** Verify an OTP and finalize signup → returns the new user. */
  verifyOtp: (email: string, code: string) => { user?: UserAccount; error?: string };
  /** Create or update a user after real email verification in Lovable Cloud. */
  upsertVerifiedUser: (data: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
  }) => UserAccount;
  /** Update password by email after a verified password-reset email flow. */
  setPasswordByEmail: (email: string, next: string) => { error?: string };
  /** Resend OTP (or rotate). */
  resendOtp: (email: string) => { code: string; error?: string };
  /** Sign-in with email + password. */
  signIn: (email: string, password: string) => { user?: UserAccount; error?: string };
  /** Update the current user's profile. */
  updateProfile: (id: string, patch: Partial<UserAccount>) => void;
  /** Change password (requires the current one). */
  changePassword: (id: string, current: string, next: string) => { error?: string };
  /** Admin: create a sub-admin account directly (no OTP). */
  createAdmin: (data: {
    name: string;
    email: string;
    password: string;
    permissions: Permission[];
  }) => { user?: UserAccount; error?: string };
  /** Admin: update permissions on a user. */
  setPermissions: (id: string, permissions: Permission[]) => void;
  /** Admin: enable/disable user. */
  setDisabled: (id: string, disabled: boolean) => void;
  /** Admin: change role. */
  setRole: (id: string, role: Role) => void;
  /** Admin: hard-delete a user (cannot delete owner). */
  removeUser: (id: string) => void;
  /** Internal helper. */
  byEmail: (email: string) => UserAccount | undefined;
}

function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OWNER: UserAccount = {
  id: "owner-root",
  name: "Owner",
  email: "owner@studyhub.app",
  password: "owner123",
  role: "admin",
  permissions: [...ALL_PERMISSIONS],
  emailVerified: true,
  createdAt: Date.now(),
  isOwner: true,
};

export const useUsers = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [OWNER],
      otps: {},

      byEmail: (email) =>
        get().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

      startSignup: ({ name, email, password, role }) => {
        const exists = get().byEmail(email);
        if (exists) return { code: "", error: "EMAIL_EXISTS" };
        if (!email.includes("@")) return { code: "", error: "BAD_EMAIL" };
        if (password.length < 6) return { code: "", error: "SHORT_PW" };

        const code = genCode();
        set({
          otps: {
            ...get().otps,
            [email.toLowerCase()]: {
              code,
              expiresAt: Date.now() + 10 * 60 * 1000,
              purpose: "signup",
              pending: {
                id: `u_${Date.now()}`,
                name,
                email,
                password,
                role,
              },
            },
          },
        });
        return { code };
      },

      resendOtp: (email) => {
        const k = email.toLowerCase();
        const rec = get().otps[k];
        if (!rec) return { code: "", error: "NO_PENDING" };
        const code = genCode();
        set({
          otps: {
            ...get().otps,
            [k]: { ...rec, code, expiresAt: Date.now() + 10 * 60 * 1000 },
          },
        });
        return { code };
      },

      verifyOtp: (email, code) => {
        const k = email.toLowerCase();
        const rec = get().otps[k];
        if (!rec) return { error: "NO_PENDING" };
        if (Date.now() > rec.expiresAt) return { error: "EXPIRED" };
        if (rec.code !== code.trim()) return { error: "BAD_CODE" };
        if (rec.purpose === "signup" && rec.pending) {
          const newUser: UserAccount = {
            ...rec.pending,
            permissions: rec.pending.permissions ?? [],
            emailVerified: true,
            createdAt: Date.now(),
          };
          // strip otp
          const otps = { ...get().otps };
          delete otps[k];
          set({ users: [...get().users, newUser], otps });
          return { user: newUser };
        }
        return { error: "BAD_PURPOSE" };
      },

      upsertVerifiedUser: ({ id, name, email, password, role }) => {
        const existing = get().byEmail(email);
        if (existing) {
          const updated: UserAccount = {
            ...existing,
            name: name || existing.name,
            password: password || existing.password,
            role: existing.isOwner ? "admin" : role,
            emailVerified: true,
          };
          set({
            users: get().users.map((u) => (u.id === existing.id ? updated : u)),
          });
          return updated;
        }
        const newUser: UserAccount = {
          id: id || `u_${Date.now()}`,
          name,
          email,
          password: password || "",
          role,
          permissions: [],
          emailVerified: true,
          createdAt: Date.now(),
        };
        set({ users: [...get().users, newUser] });
        return newUser;
      },

      setPasswordByEmail: (email, next) => {
        if (next.length < 6) return { error: "SHORT_PW" };
        const existing = get().byEmail(email);
        if (!existing) return {};
        set({
          users: get().users.map((u) =>
            u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: next } : u,
          ),
        });
        return {};
      },

      signIn: (email, password) => {
        const u = get().byEmail(email);
        if (!u) return { error: "NOT_FOUND" };
        if (!u.emailVerified) return { error: "NOT_VERIFIED" };
        if (u.disabled) return { error: "DISABLED" };
        if (u.password !== password) return { error: "BAD_PW" };
        return { user: u };
      },

      updateProfile: (id, patch) =>
        set({
          users: get().users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  ...patch,
                  // protect immutable fields
                  id: u.id,
                  isOwner: u.isOwner,
                  permissions: u.isOwner ? ALL_PERMISSIONS : (patch.permissions ?? u.permissions),
                }
              : u,
          ),
        }),

      changePassword: (id, current, next) => {
        const u = get().users.find((x) => x.id === id);
        if (!u) return { error: "NOT_FOUND" };
        if (u.password !== current) return { error: "BAD_PW" };
        if (next.length < 6) return { error: "SHORT_PW" };
        set({
          users: get().users.map((x) => (x.id === id ? { ...x, password: next } : x)),
        });
        return {};
      },

      createAdmin: ({ name, email, password, permissions }) => {
        if (get().byEmail(email)) return { error: "EMAIL_EXISTS" };
        if (!email.includes("@")) return { error: "BAD_EMAIL" };
        if (password.length < 6) return { error: "SHORT_PW" };
        const u: UserAccount = {
          id: `a_${Date.now()}`,
          name,
          email,
          password,
          role: "admin",
          permissions,
          emailVerified: true,
          createdAt: Date.now(),
        };
        set({ users: [...get().users, u] });
        return { user: u };
      },

      setPermissions: (id, permissions) =>
        set({
          users: get().users.map((u) =>
            u.id === id && !u.isOwner ? { ...u, permissions } : u,
          ),
        }),

      setDisabled: (id, disabled) =>
        set({
          users: get().users.map((u) =>
            u.id === id && !u.isOwner ? { ...u, disabled } : u,
          ),
        }),

      setRole: (id, role) =>
        set({
          users: get().users.map((u) =>
            u.id === id && !u.isOwner ? { ...u, role } : u,
          ),
        }),

      removeUser: (id) =>
        set({ users: get().users.filter((u) => u.id !== id || u.isOwner) }),
    }),
    { name: "studyhub-users-v1", version: 1 },
  ),
);

/** Helper: does the given user have a permission? Owners always do. */
export function hasPermission(
  user:
    | { isOwner?: boolean; permissions?: Permission[]; role?: Role; email?: string }
    | null
    | undefined,
  perm: Permission,
): boolean {
  if (!user) return false;
  if (user.role !== "admin") return false;
  if (user.email?.toLowerCase() === OWNER.email) return true;
  if (user.isOwner) return true;
  return !!user.permissions?.includes(perm);
}
