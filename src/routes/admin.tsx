import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Shield, FileText, ScrollText, Brain, BookOpen,
  Check, X, Clock, ListChecks, Lock, Unlock, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useProducts } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
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
    </div>
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
