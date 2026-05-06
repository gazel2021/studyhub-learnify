import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Wallet, Loader2, Sparkles } from "lucide-react";
import { useCart } from "@/lib/store";
import { useT, useI18n } from "@/lib/i18n";
import { CURRENCIES, formatCurrency, currencyForCountry } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { authenticateWithPi, createPiPayment, isPiBrowser, loadPiSdk, usdToPi } from "@/lib/pi";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

type Method = "pi" | "card" | "paypal";

function CheckoutPage() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
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

  // Default currency from first item
  const defaultCurrency = items[0] ? currencyForCountry(items[0].country).code : "USD";
  const [currencyCode, setCurrencyCode] = useState<string>(defaultCurrency);

  useEffect(() => { loadPiSdk().then((sdk) => setPiReady(!!sdk)); }, []);
  useEffect(() => {
    if (method === "pi") setCurrencyCode("PI");
    else if (currencyCode === "PI") setCurrencyCode(defaultCurrency);
  }, [method]); // eslint-disable-line

  const localCurrencies = useMemo(
    () => Object.values(CURRENCIES).filter((c) => c.code !== "PI"),
    [],
  );

  const handleConnectPi = async () => {
    setProcessing(true);
    const auth = await authenticateWithPi();
    setProcessing(false);
    if (!auth) { toast.error(inPiBrowser ? "Pi auth failed" : t("checkout.pi.openInBrowser")); return; }
    setPiUser(auth.user.username);
    toast.success(`${t("checkout.pi.connected")} @${auth.user.username}`);
  };

  const handlePayPi = async () => {
    if (!piUser) { await handleConnectPi(); return; }
    setProcessing(true);
    const ok = await createPiPayment(
      { amount: totalPi, memo: `StudyHub purchase (${items.length})`, metadata: { items: items.map((i) => i.id), totalUsd } },
      {
        onReadyForServerCompletion: () => {
          purchase(); setDone(true); setProcessing(false);
          toast.success(t("checkout.success.t"));
        },
        onCancel: () => { setProcessing(false); },
        onError: (err) => { setProcessing(false); toast.error(err.message); },
      }
    );
    if (!ok) { setProcessing(false); toast.error(t("checkout.pi.openInBrowser")); }
  };

  const handlePayMock = () => {
    setProcessing(true);
    setTimeout(() => {
      purchase(); setDone(true); setProcessing(false);
      toast.success(t("checkout.success.t"));
    }, 1100);
  };

  const handlePay = () => method === "pi" ? handlePayPi() : handlePayMock();

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto h-24 w-24 rounded-full bg-gradient-neon flex items-center justify-center shadow-glow-purple">
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl font-bold font-display mt-6">{t("checkout.success.t")}</h1>
        <p className="text-muted-foreground mt-2">{t("checkout.success.d")}</p>
        <Button onClick={() => navigate({ to: "/dashboard" })} className="mt-6 h-12 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
          {t("checkout.goDashboard")}
        </Button>
      </div>
    );
  }

  const METHODS: { id: Method; name: string; desc: string; icon: typeof CreditCard }[] = [
    { id: "pi", name: t("checkout.method.pi.name"), desc: t("checkout.method.pi.desc"), icon: PiIcon as never },
    { id: "card", name: t("checkout.method.card.name"), desc: t("checkout.method.card.desc"), icon: CreditCard },
    { id: "paypal", name: "PayPal", desc: "Pay securely with your PayPal account", icon: Wallet },
  ];

  const displayPrice = formatCurrency(totalUsd, currencyCode, lang);

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold font-display mb-8">{t("checkout.title")}</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-6">
        <div>
          <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            {t("checkout.method")}
          </h2>
          <div className="space-y-3">
            {METHODS.map((m) => (
              <button
                key={m.id} type="button" onClick={() => setMethod(m.id)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-smooth text-start ${
                  method === m.id ? "border-[oklch(0.68_0.22_255)]/60 bg-white/5 shadow-glow-blue" : "border-white/5 hover:border-white/20 glass"
                }`}
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                  method === m.id ? "bg-gradient-neon text-white shadow-glow-blue" : "bg-white/5 text-muted-foreground"
                }`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold flex items-center gap-2">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                {method === m.id && <Check className="h-5 w-5 text-[oklch(0.78_0.20_150)]" />}
              </button>
            ))}
          </div>

          {method !== "pi" && (
            <div className="mt-6">
              <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                {t("checkout.currency")}
              </h2>
              <Select value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger className="h-12 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {localCurrencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="font-mono me-2">{c.symbol}</span>
                      {lang === "ar" ? c.arName : lang === "fr" ? c.frName : c.enName}
                      <span className="text-muted-foreground text-xs ms-2">({c.code})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {method === "pi" && (
            <div className="mt-4 p-4 rounded-2xl glass border border-[oklch(0.78_0.18_65)]/30">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.18_65)] to-[oklch(0.65_0.25_25)] flex items-center justify-center shrink-0">
                  <PiIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 text-sm">
                  {!inPiBrowser && <p className="text-muted-foreground mb-2">{t("checkout.pi.openInBrowser")}</p>}
                  {piUser ? (
                    <p className="font-medium">{t("checkout.pi.connected")} <span className="text-[oklch(0.78_0.18_65)]">@{piUser}</span></p>
                  ) : (
                    <Button size="sm" onClick={handleConnectPi} disabled={!piReady || processing}
                      className="bg-gradient-to-br from-[oklch(0.78_0.18_65)] to-[oklch(0.65_0.25_25)] text-white rounded-full">
                      {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : t("checkout.pi.connect")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-fit glass-strong border-gradient rounded-3xl p-6 sticky top-24">
          <h3 className="font-bold font-display mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[oklch(0.66_0.24_295)]" />
            {t("checkout.summary")}
          </h3>
          <div className="space-y-2 text-sm max-h-48 overflow-y-auto pe-1">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.title}</span>
                <span className="font-semibold whitespace-nowrap">${i.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>{t("cart.total")}</span>
            <span className="text-gradient-neon">{displayPrice}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-end font-mono">
            {t("checkout.equivalent")} ${totalUsd.toFixed(2)}
          </div>
          <Button
            onClick={handlePay}
            disabled={processing || items.length === 0}
            className="w-full mt-6 h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : `${t("checkout.payNow")} · ${displayPrice}`}
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
