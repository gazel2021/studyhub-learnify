/**
 * Pi Network SDK integration
 * Loads the Pi SDK from official CDN and exposes typed helpers.
 *
 * Docs: https://minepi.com/developers
 * The SDK is only available inside the Pi Browser.
 */

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}

export interface PiAuthResult {
  accessToken: string;
  user: { uid: string; username: string };
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

interface PiSDK {
  init: (config: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: unknown) => void
  ) => Promise<PiAuthResult>;
  createPayment: (
    paymentData: PiPaymentData,
    callbacks: PiPaymentCallbacks
  ) => void;
}

const PI_SDK_URL = "https://sdk.minepi.com/pi-sdk.js";
let sdkPromise: Promise<PiSDK | null> | null = null;

export function isPiBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /PiBrowser/i.test(navigator.userAgent);
}

export function loadPiSdk(): Promise<PiSDK | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Pi) return Promise.resolve(window.Pi);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PI_SDK_URL}"]`
    );
    const handle = () => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });
        } catch {
          // Already initialized
        }
        resolve(window.Pi);
      } else {
        resolve(null);
      }
    };

    if (existing) {
      existing.addEventListener("load", handle, { once: true });
      existing.addEventListener("error", () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = PI_SDK_URL;
    script.async = true;
    script.onload = handle;
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return sdkPromise;
}

export async function authenticateWithPi(): Promise<PiAuthResult | null> {
  const Pi = await loadPiSdk();
  if (!Pi) return null;
  try {
    return await Pi.authenticate(["username", "payments"], (payment) => {
      console.warn("Incomplete Pi payment found:", payment);
    });
  } catch (err) {
    console.error("Pi auth failed:", err);
    return null;
  }
}

export async function createPiPayment(
  data: PiPaymentData,
  callbacks: Partial<PiPaymentCallbacks> = {}
): Promise<boolean> {
  const Pi = await loadPiSdk();
  if (!Pi) return false;

  Pi.createPayment(data, {
    onReadyForServerApproval: (paymentId) => {
      console.log("[Pi] approve:", paymentId);
      callbacks.onReadyForServerApproval?.(paymentId);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("[Pi] complete:", paymentId, txid);
      callbacks.onReadyForServerCompletion?.(paymentId, txid);
    },
    onCancel: (paymentId) => {
      console.log("[Pi] cancel:", paymentId);
      callbacks.onCancel?.(paymentId);
    },
    onError: (error, payment) => {
      console.error("[Pi] error:", error, payment);
      callbacks.onError?.(error, payment);
    },
  });
  return true;
}

/** Approximate USD → Pi conversion for display. Replace with live rate when available. */
export const PI_RATE_USD = 0.6; // 1 Pi ≈ $0.6 (mock)
export function usdToPi(usd: number): number {
  return Math.max(0.01, +(usd / PI_RATE_USD).toFixed(2));
}
