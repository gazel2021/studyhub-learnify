import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Wallet, TrendingUp, Coins, Clock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useAffiliate } from "@/lib/affiliate";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/affiliate")({
  component: AffiliatePage,
});

function AffiliatePage() {
  const t = useT();
  const user = useAuth((s) => s.user);
  const apps = useAffiliate((s) => s.apps);
  const sales = useAffiliate((s) => s.sales);
  const withdrawals = useAffiliate((s) => s.withdrawals);
  const apply = useAffiliate((s) => s.apply);
  const requestWithdraw = useAffiliate((s) => s.requestWithdraw);
  const balanceFor = useAffiliate((s) => s.balanceFor);

  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Share2 className="h-16 w-16 mx-auto mb-4 text-[oklch(0.66_0.24_295)]" />
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <Link to="/auth">
          <Button className="mt-6 h-12 px-6 rounded-full bg-gradient-neon text-white">
            {t("nav.signin")}
          </Button>
        </Link>
      </div>
    );
  }

  const app = apps.find((a) => a.userId === user.id);
  const mySales = useMemo(
    () => sales.filter((s) => s.affiliateUserId === user.id),
    [sales, user.id],
  );
  const myWithdrawals = useMemo(
    () => withdrawals.filter((w) => w.affiliateUserId === user.id),
    [withdrawals, user.id],
  );
  const bal = balanceFor(user.id);

  const referralUrl =
    app && app.status === "approved" && typeof window !== "undefined"
      ? `${window.location.origin}/products?ref=${app.code}`
      : "";

  const handleApply = () => {
    const res = apply({ id: user.id, name: user.name, email: user.email, note });
    if (res.error === "ALREADY_APPLIED") {
      toast.error(t("aff.err.applied"));
    } else if (res.ok) {
      toast.success(t("aff.apply.sent"));
      setNote("");
    }
  };

  const handleCopy = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success(t("aff.link.copied"));
    setTimeout(() => setCopied(false), 1500);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error(t("aff.err.amount"));
    const res = requestWithdraw({
      affiliateUserId: user.id,
      amountUsd: amt,
      method,
      details,
    });
    if (res.error === "INSUFFICIENT") return toast.error(t("aff.err.insufficient"));
    if (res.error === "MISSING_DETAILS") return toast.error(t("aff.err.missing"));
    if (res.error === "BAD_AMOUNT") return toast.error(t("aff.err.amount"));
    if (res.ok) {
      toast.success(t("aff.withdraw.success"));
      setAmount("");
      setMethod("");
      setDetails("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
          <Share2 className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
          <span>{t("nav.affiliate")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">{t("aff.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("aff.subtitle")}</p>
      </motion.div>

      {/* No application yet */}
      {!app && (
        <div className="glass rounded-3xl p-6 md:p-8 max-w-2xl">
          <h2 className="text-xl font-bold font-display mb-2">{t("aff.apply.t")}</h2>
          <p className="text-muted-foreground text-sm mb-4">{t("aff.apply.d")}</p>
          <Textarea
            placeholder={t("aff.apply.note")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-background/50 rounded-xl min-h-24"
          />
          <Button
            onClick={handleApply}
            className="mt-4 h-12 px-6 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue"
          >
            {t("aff.apply.submit")}
          </Button>
        </div>
      )}

      {/* Pending */}
      {app && app.status === "pending" && (
        <div className="glass rounded-3xl p-8 max-w-2xl text-center">
          <Clock className="h-14 w-14 mx-auto mb-3 text-amber-400" />
          <h2 className="text-xl font-bold font-display">{t("aff.pending.t")}</h2>
          <p className="text-muted-foreground mt-2">{t("aff.pending.d")}</p>
        </div>
      )}

      {/* Rejected */}
      {app && app.status === "rejected" && (
        <div className="glass rounded-3xl p-8 max-w-2xl text-center">
          <h2 className="text-xl font-bold font-display text-rose-300">{t("aff.rejected.t")}</h2>
          <p className="text-muted-foreground mt-2">{t("aff.rejected.d")}</p>
        </div>
      )}

      {/* Approved */}
      {app && app.status === "approved" && (
        <div className="space-y-6">
          {/* Referral link */}
          <div className="glass-strong border-gradient rounded-3xl p-6">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              {t("aff.link.t")}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <code className="flex-1 min-w-0 truncate font-mono text-sm bg-background/50 rounded-xl px-4 py-3 border border-white/10">
                {referralUrl}
              </code>
              <Button
                onClick={handleCopy}
                className="h-12 px-5 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue"
              >
                {copied ? <Check className="h-4 w-4 me-2" /> : <Copy className="h-4 w-4 me-2" />}
                {copied ? t("aff.link.copied") : t("aff.link.copy")}
              </Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground font-mono">
              {t("aff.code")}: <span className="text-foreground font-bold">{app.code}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Stat icon={TrendingUp} color="text-emerald-400" label={t("aff.stat.earned")} value={`$${bal.earned.toFixed(2)}`} />
            <Stat icon={Coins} color="text-[oklch(0.78_0.18_65)]" label={t("aff.stat.available")} value={`$${bal.available.toFixed(2)}`} />
            <Stat icon={Clock} color="text-amber-400" label={t("aff.stat.pendingW")} value={`$${bal.pending.toFixed(2)}`} />
            <Stat icon={Wallet} color="text-[oklch(0.68_0.22_255)]" label={t("aff.stat.paid")} value={`$${bal.paid.toFixed(2)}`} />
            <Stat icon={ShoppingBag} color="text-[oklch(0.66_0.24_295)]" label={t("aff.stat.sales")} value={String(mySales.length)} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Withdraw */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold font-display mb-4">{t("aff.withdraw.t")}</h3>
              <div className="space-y-3">
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("aff.withdraw.amount")}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background/50 rounded-xl h-11"
                />
                <Input
                  placeholder={t("aff.withdraw.methodPh")}
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-background/50 rounded-xl h-11"
                />
                <Input
                  placeholder={t("aff.withdraw.detailsPh")}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-background/50 rounded-xl h-11"
                />
                <Button
                  onClick={handleWithdraw}
                  className="w-full h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue"
                >
                  {t("aff.withdraw.submit")}
                </Button>
              </div>
            </div>

            {/* Withdrawals history */}
            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold font-display mb-4">{t("aff.withdraw.history")}</h3>
              {myWithdrawals.length === 0 ? (
                <p className="text-muted-foreground text-sm">{t("aff.withdraw.empty")}</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pe-1">
                  {myWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-background/40 border border-white/5"
                    >
                      <div>
                        <div className="font-bold">${w.amountUsd.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{w.method}</div>
                      </div>
                      <WithdrawStatusBadge status={w.status} t={t} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sales history */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold font-display mb-4">{t("aff.sales.t")}</h3>
            {mySales.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("aff.sales.empty")}</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pe-1">
                {mySales.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-background/40 border border-white/5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm line-clamp-1">{s.productTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString()} · ${s.amountUsd.toFixed(2)} ·{" "}
                        {s.commissionPercent}%
                      </div>
                    </div>
                    <div className="font-extrabold text-gradient-neon">
                      +${s.commissionUsd.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className={`h-5 w-5 ${color} mb-2`} />
      <div className="text-xl font-extrabold font-display">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function WithdrawStatusBadge({
  status,
  t,
}: {
  status: "pending" | "paid" | "rejected";
  t: (k: string) => string;
}) {
  const map = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    rejected: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${map[status]}`}
    >
      {t(`aff.withdraw.status.${status}`)}
    </span>
  );
}
