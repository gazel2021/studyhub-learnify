import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Wallet, Loader2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  authenticateWithPi,
  createPiPayment,
  isPiBrowser,
  loadPiSdk,
  usdToPi,
} from "@/lib/pi";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

type Method = "pi" | "card" | "local";

function CheckoutPage() {
  const { items, purchase } = useCart();
  const [method, setMethod] = useState<Method>("pi");
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [piReady, setPiReady] = useState(false);
  const [piUser, setPiUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const totalUsd = items.reduce((s, i) => s + i.price, 0);
  const totalPi = usdToPi(totalUsd);
  const inPiBrowser = typeof window !== "undefined" && isPiBrowser();

  useEffect(() => {
    loadPiSdk().then((sdk) => setPiReady(!!sdk));
  }, []);

  const handleConnectPi = async () => {
    setProcessing(true);
    const auth = await authenticateWithPi();
    setProcessing(false);
    if (!auth) {
      toast.error(
        inPiBrowser
          ? "Failed to authenticate with Pi"
          : "Open this app in the Pi Browser to use Pi payments"
      );
      return;
    }
    setPiUser(auth.user.username);
    toast.success(`Connected as @${auth.user.username}`);
  };

  const handlePayPi = async () => {
    if (!piUser) {
      await handleConnectPi();
      return;
    }
    setProcessing(true);
    const ok = await createPiPayment(
      {
        amount: totalPi,
        memo: `StudyHub purchase (${items.length} items)`,
        metadata: { items: items.map((i) => i.id), totalUsd },
      },
      {
        onReadyForServerCompletion: () => {
          // In production: call your backend to verify the txid with Pi API
          purchase();
          setDone(true);
          setProcessing(false);
          toast.success("Pi payment confirmed!");
        },
        onCancel: () => {
          setProcessing(false);
          toast.info("Payment cancelled");
        },
        onError: (err) => {
          setProcessing(false);
          toast.error(err.message || "Pi payment failed");
        },
      }
    );
    if (!ok) {
      setProcessing(false);
      toast.error("Pi SDK unavailable. Open in Pi Browser.");
    }
  };

  const handlePayMock = () => {
    setProcessing(true);
    setTimeout(() => {
      purchase();
      setDone(true);
      setProcessing(false);
      toast.success("Payment successful!");
    }, 1100);
  };

  const handlePay = () => {
    if (method === "pi") return handlePayPi();
    return handlePayMock();
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto h-24 w-24 rounded-full bg-success flex items-center justify-center shadow-glow"
        >
          <Check className="h-12 w-12 text-success-foreground" strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl font-bold mt-6">Payment successful!</h1>
        <p className="text-muted-foreground mt-2">Your resources are ready in your dashboard.</p>
        <Button onClick={() => navigate({ to: "/dashboard" })} className="mt-6 h-12 px-6 rounded-xl bg-gradient-brand text-white">
          Go to dashboard
        </Button>
      </div>
    );
  }

  const METHODS: { id: Method; name: string; desc: string; icon: typeof CreditCard }[] = [
    { id: "pi", name: "Pi Network", desc: `Pay ${totalPi} π with Pi Browser`, icon: PiIcon as never },
    { id: "card", name: "Credit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
    { id: "local", name: "Local Payment", desc: "Bank transfer or wallet", icon: Wallet },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="font-semibold mb-3">Choose payment method</h2>
          <div className="space-y-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-smooth text-left ${
                  method === m.id ? "border-primary bg-primary/5 shadow-elegant" : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                  method === m.id
                    ? m.id === "pi" ? "bg-pi" : "bg-gradient-brand text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    {m.name}
                    {m.id === "pi" && (
                      <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-pi/10 text-pi">
                        Crypto
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                {method === m.id && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>

          {method === "pi" && (
            <div className="mt-4 p-4 rounded-2xl glass border border-pi/30">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-pi flex items-center justify-center shrink-0">
                  <PiIcon className="h-5 w-5 text-pi-foreground" />
                </div>
                <div className="flex-1 text-sm">
                  {!inPiBrowser && (
                    <p className="text-muted-foreground mb-2">
                      For real Pi payments, open this app inside the <strong>Pi Browser</strong>.
                      Outside Pi Browser the SDK will not load.
                    </p>
                  )}
                  {piUser ? (
                    <p className="font-medium">
                      Connected as <span className="text-pi">@{piUser}</span>
                    </p>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleConnectPi}
                      disabled={!piReady || processing}
                      className="bg-pi text-pi-foreground hover:opacity-90 rounded-xl"
                    >
                      {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect Pi account"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="line-clamp-1 mr-2">{i.title}</span>
                <span className="font-semibold">${i.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-gradient-brand">${totalUsd.toFixed(2)}</span>
          </div>
          {method === "pi" && (
            <div className="flex justify-between text-sm text-pi font-semibold mt-1">
              <span>≈ in Pi</span>
              <span>{totalPi} π</span>
            </div>
          )}
          <Button
            onClick={handlePay}
            disabled={processing || items.length === 0}
            className={`w-full mt-6 h-12 rounded-xl text-white shadow-elegant ${
              method === "pi" ? "bg-pi hover:opacity-90" : "bg-gradient-brand"
            }`}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : method === "pi" ? (
              `Pay ${totalPi} π`
            ) : (
              `Pay $${totalUsd.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5 6h14v2.5h-3v9.5h-2.5V8.5h-4v9.5H7V8.5H5z" />
    </svg>
  );
}
