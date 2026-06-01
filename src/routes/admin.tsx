import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Shield, FileText, ScrollText, Brain, BookOpen,
  Check, X, Clock, ListChecks, Lock, Unlock, Eye, Share2, Wallet, Percent,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useProducts } from "@/lib/products";
import { useAffiliate } from "@/lib/affiliate";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const TYPE_ICONS = { book: FileText, exam: ScrollText, quiz: Brain };

function AdminPage() {
  const t = useT();
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const products = useProducts((s) => s.items);
  const removeProduct = useProducts((s) => s.remove);
  const setStatus = useProducts((s) => s.setStatus);
  const setUnlocked = useProducts((s) => s.setUnlocked);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const buckets = useMemo(() => ({
    pending: products.filter((p) => p.status === "pending"),
    approved: products.filter((p) => p.status === "approved"),
    rejected: products.filter((p) => p.status === "rejected"),
    all: products,
  }), [products]);

  // Quick admin login fallback
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-[oklch(0.66_0.24_295)]" />
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <p className="text-muted-foreground mt-2">{t("admin.denied")}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={() => {
              login({ id: "admin-1", name: "Admin", email: "admin@studyhub.app", role: "admin" });
              toast.success(t("auth.welcome"));
            }}
            className="h-12 rounded-xl bg-gradient-neon text-white shadow-glow-blue"
          >
            <Shield className="h-4 w-4 me-2" />
            {t("admin.signinAsAdmin")}
          </Button>
          <Link to="/auth">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              {t("common.goSignin")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-rose-400" />
        <h1 className="text-2xl font-bold">{t("admin.denied")}</h1>
        <Link to="/">
          <Button className="mt-6 rounded-xl bg-gradient-neon text-white">{t("nav.home")}</Button>
        </Link>
      </div>
    );
  }

  const list = buckets[tab];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
            <span>{t("nav.admin")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">{t("admin.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.subtitle")}</p>
        </div>
        <Link to="/upload">
          <Button className="h-12 px-6 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth">
            <Plus className="h-5 w-5 me-2" />
            {t("admin.add")}
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Clock} color="text-amber-400" label={t("admin.pending")} value={buckets.pending.length} />
        <StatCard icon={Check} color="text-emerald-400" label={t("admin.approved")} value={buckets.approved.length} />
        <StatCard icon={X} color="text-rose-400" label={t("admin.rejected")} value={buckets.rejected.length} />
        <StatCard icon={ListChecks} color="text-[oklch(0.68_0.22_255)]" label={t("admin.tab.all")} value={buckets.all.length} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="glass rounded-full p-1 mb-6">
          <TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            <Clock className="h-3.5 w-3.5 me-1.5" />
            {t("admin.pending")} ({buckets.pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.approved")}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.rejected")}
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.tab.all")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <div className="glass rounded-3xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-[oklch(0.68_0.22_255)]" />
              <h2 className="text-lg md:text-xl font-bold font-display">
                {t("admin.list")}{" "}
                <span className="text-muted-foreground font-normal">({list.length})</span>
              </h2>
            </div>

            {list.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">{t("products.empty")}</div>
            ) : (
              <div className="grid gap-3">
                {list.map((p) => {
                  const Icon = TYPE_ICONS[p.type] ?? FileText;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-background/40 border border-white/5 hover:border-white/15 transition-smooth"
                    >
                      <img src={p.image} alt={p.title} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Icon className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            {t(`type.${p.type}`)} · {t(`subject.${p.subject}`)} · {t(`country.${p.country}`)} · {t(`stage.${p.stage}`)}
                          </span>
                          <StatusBadge status={p.status} t={t} />
                        </div>
                        <Link to="/products/$id" params={{ id: p.id }} className="font-bold text-sm line-clamp-1 hover:text-gradient-neon">
                          {p.title}
                        </Link>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {t("card.by")} {p.author}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="font-extrabold text-gradient-neon">
                          {p.price === 0 ? t("card.free") : `$${p.price}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {p.status !== "approved" && (
                          <Button size="sm" onClick={() => { setStatus(p.id, "approved"); toast.success(t("admin.approve")); }}
                            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                            <Check className="h-3.5 w-3.5 me-1" /> {t("admin.approve")}
                          </Button>
                        )}
                        {p.status !== "rejected" && (
                          <Button size="sm" variant="outline" onClick={() => { setStatus(p.id, "rejected"); toast(t("admin.reject")); }}
                            className="rounded-full border-rose-400/40 text-rose-300 hover:bg-rose-500/10">
                            <X className="h-3.5 w-3.5 me-1" /> {t("admin.reject")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const next = !p.unlocked;
                            setUnlocked(p.id, next);
                            toast.success(next ? t("admin.unlocked") : t("admin.locked"));
                          }}
                          className={`rounded-full ${p.unlocked ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10" : "border-amber-400/40 text-amber-300 hover:bg-amber-500/10"}`}
                        >
                          {p.unlocked ? <Unlock className="h-3.5 w-3.5 me-1" /> : <Lock className="h-3.5 w-3.5 me-1" />}
                          {p.unlocked ? t("admin.unlock") : t("admin.lock")}
                        </Button>
                        <Link to="/reader/$id" params={{ id: p.id }}>
                          <Button size="sm" variant="outline" className="rounded-full">
                            <Eye className="h-3.5 w-3.5 me-1" /> {t("admin.view")}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => { if (confirm(t("admin.confirm"))) removeProduct(p.id); }}
                          className="rounded-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AffiliateAdminSection t={t} />
    </div>
  );
}

function AffiliateAdminSection({ t }: { t: (k: string) => string }) {
  const apps = useAffiliate((s) => s.apps);
  const withdrawals = useAffiliate((s) => s.withdrawals);
  const approveApp = useAffiliate((s) => s.approveApp);
  const rejectApp = useAffiliate((s) => s.rejectApp);
  const markPaid = useAffiliate((s) => s.markPaid);
  const rejectWithdraw = useAffiliate((s) => s.rejectWithdraw);
  const defaultPercent = useAffiliate((s) => s.defaultPercent);
  const setDefaultPercent = useAffiliate((s) => s.setDefaultPercent);
  const products = useProducts((s) => s.items);
  const setCommission = useProducts((s) => s.setCommission);
  const [tab, setTab] = useState<"apps" | "withdrawals" | "commissions">("apps");

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
            <Share2 className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
            <span>{t("nav.affiliate")}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight">{t("admin.aff.t")}</h2>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-2">
          <Percent className="h-4 w-4 text-[oklch(0.66_0.24_295)]" />
          <span className="text-xs text-muted-foreground">{t("admin.aff.defaultPercent")}</span>
          <Input
            type="number"
            min={0}
            max={90}
            value={defaultPercent}
            onChange={(e) => setDefaultPercent(parseInt(e.target.value, 10) || 0)}
            className="h-8 w-20 bg-background/50 rounded-lg"
          />
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="glass rounded-full p-1 mb-6">
          <TabsTrigger value="apps" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.aff.tab.apps")} ({apps.filter((a) => a.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.aff.tab.withdrawals")} ({withdrawals.filter((w) => w.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="commissions" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white">
            {t("admin.aff.tab.commissions")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apps">
          <div className="glass rounded-3xl p-4 md:p-6">
            {apps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{t("admin.aff.appsEmpty")}</div>
            ) : (
              <div className="grid gap-3">
                {apps.map((a) => (
                  <div key={a.userId} className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-background/40 border border-white/5">
                    <div className="flex-1 min-w-[200px]">
                      <div className="font-bold">{a.userName}</div>
                      <div className="text-xs text-muted-foreground">{a.userEmail}</div>
                      {a.note && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">"{a.note}"</div>}
                      <div className="text-[10px] font-mono mt-1 text-[oklch(0.66_0.24_295)]">{a.code}</div>
                    </div>
                    <StatusPill status={a.status} t={t} />
                    <div className="flex items-center gap-1.5">
                      {a.status !== "approved" && (
                        <Button size="sm" onClick={() => { approveApp(a.userId); toast.success(t("admin.aff.approve")); }}
                          className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                          <Check className="h-3.5 w-3.5 me-1" /> {t("admin.aff.approve")}
                        </Button>
                      )}
                      {a.status !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => { rejectApp(a.userId); toast(t("admin.aff.reject")); }}
                          className="rounded-full border-rose-400/40 text-rose-300 hover:bg-rose-500/10">
                          <X className="h-3.5 w-3.5 me-1" /> {t("admin.aff.reject")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="withdrawals">
          <div className="glass rounded-3xl p-4 md:p-6">
            {withdrawals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{t("admin.aff.withdrawalsEmpty")}</div>
            ) : (
              <div className="grid gap-3">
                {withdrawals.map((w) => {
                  const app = apps.find((a) => a.userId === w.affiliateUserId);
                  return (
                    <div key={w.id} className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-background/40 border border-white/5">
                      <Wallet className="h-5 w-5 text-[oklch(0.78_0.18_65)]" />
                      <div className="flex-1 min-w-[200px]">
                        <div className="font-bold">{app?.userName ?? w.affiliateUserId}</div>
                        <div className="text-xs text-muted-foreground">{w.method} · {w.details}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(w.requestedAt).toLocaleString()}</div>
                      </div>
                      <div className="font-extrabold text-gradient-neon">${w.amountUsd.toFixed(2)}</div>
                      <StatusPill status={w.status} t={t} />
                      {w.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" onClick={() => { markPaid(w.id); toast.success(t("admin.aff.markPaid")); }}
                            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                            <Check className="h-3.5 w-3.5 me-1" /> {t("admin.aff.markPaid")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { rejectWithdraw(w.id); toast(t("admin.aff.reject")); }}
                            className="rounded-full border-rose-400/40 text-rose-300 hover:bg-rose-500/10">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <div className="glass rounded-3xl p-4 md:p-6">
            <div className="grid gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-background/40 border border-white/5">
                  <img src={p.image} alt={p.title} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-sm line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground">${p.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{t("admin.aff.commission")}</span>
                    <Input
                      type="number"
                      min={0}
                      max={90}
                      placeholder={t("admin.aff.commissionPh")}
                      value={p.commissionPercent ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCommission(p.id, v === "" ? undefined : parseInt(v, 10) || 0);
                      }}
                      className="h-9 w-20 bg-background/50 rounded-lg"
                    />
                    <span className="text-xs font-mono text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusPill({ status, t }: { status: string; t: (k: string) => string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    approved: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    rejected: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  };
  const labelKey =
    status === "paid" || status === "rejected" || status === "pending"
      ? `aff.withdraw.status.${status}`
      : `aff.status.${status}`;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${map[status] ?? ""}`}>
      {t(labelKey)}
    </span>
  );
}

function StatCard({ icon: Icon, color, label, value }: {
  icon: React.ComponentType<{ className?: string }>; color: string; label: string; value: number;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-extrabold font-display">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: "pending" | "approved" | "rejected"; t: (k: string) => string }) {
  const map = {
    pending: { c: "bg-amber-500/15 text-amber-300 border-amber-400/30", icon: Clock },
    approved: { c: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30", icon: Check },
    rejected: { c: "bg-rose-500/15 text-rose-300 border-rose-400/30", icon: X },
  } as const;
  const m = map[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${m.c}`}>
      <Icon className="h-2.5 w-2.5" />
      {t(`status.${status}`)}
    </span>
  );
}
