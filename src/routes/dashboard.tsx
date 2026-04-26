import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, DollarSign, Users, TrendingUp, Plus, Download, Clock, Check, X } from "lucide-react";
import { useAuth, useCart } from "@/lib/store";
import { useProducts, selectApproved } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const t = useT();
  const user = useAuth((s) => s.user);
  const purchased = useCart((s) => s.purchased);
  const all = useProducts((s) => s.items);
  const approved = selectApproved(all);
  const ownedProducts = approved.filter((p) => purchased.includes(p.id));
  const mySubmissions = user ? all.filter((p) => p.ownerId === user.id) : [];

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <p className="text-muted-foreground mt-2">{t("common.signinDesc")}</p>
        <Link to="/auth">
          <Button className="mt-6 h-12 px-6 rounded-full bg-gradient-neon text-white shadow-glow-blue">
            {t("common.goSignin")}
          </Button>
        </Link>
      </div>
    );
  }

  const stats =
    user.role === "student"
      ? [
          { label: t("dash.stat.owned"), value: ownedProducts.length, icon: BookOpen, color: "from-[oklch(0.68_0.22_255)] to-[oklch(0.82_0.16_200)]" },
          { label: t("dash.stat.quizzes"), value: 12, icon: TrendingUp, color: "from-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" },
          { label: t("dash.stat.score"), value: "87%", icon: DollarSign, color: "from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)]" },
        ]
      : user.role === "teacher"
      ? [
          { label: t("dash.stat.products"), value: mySubmissions.length, icon: BookOpen, color: "from-[oklch(0.68_0.22_255)] to-[oklch(0.82_0.16_200)]" },
          { label: t("dash.stat.sales"), value: 342, icon: TrendingUp, color: "from-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" },
          { label: t("dash.stat.earnings"), value: "$2,840", icon: DollarSign, color: "from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)]" },
        ]
      : [
          { label: t("dash.stat.users"), value: "12.4k", icon: Users, color: "from-[oklch(0.68_0.22_255)] to-[oklch(0.82_0.16_200)]" },
          { label: t("dash.stat.allproducts"), value: all.length, icon: BookOpen, color: "from-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" },
          { label: t("dash.stat.revenue"), value: "$48k", icon: DollarSign, color: "from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)]" },
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{t(`dash.role.${user.role}`)}</p>
          <h1 className="text-3xl md:text-4xl font-bold font-display">
            {t("dash.welcome", { name: user.name })}
          </h1>
        </div>
        {(user.role === "teacher" || user.role === "admin") && (
          <Link to="/upload">
            <Button className="h-11 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:scale-105 transition-smooth">
              <Plus className="h-4 w-4 me-2" /> {t("dash.new")}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-strong border-gradient rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{s.label}</div>
                <div className="text-3xl font-extrabold mt-1 font-display">{s.value}</div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-glow-blue`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Library / Recent */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold font-display mb-4">
          {user.role === "student" ? t("dash.library") : user.role === "teacher" ? t("dash.products") : t("dash.recent")}
        </h2>
        {user.role === "student" && ownedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t("dash.empty")}</p>
            <Link to="/products">
              <Button className="bg-gradient-neon text-white rounded-full px-6 shadow-glow-blue">{t("dash.browse")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(user.role === "student" ? ownedProducts : approved.slice(0, 6)).map((p) => (
              <Link key={p.id} to="/reader/$id" params={{ id: p.id }}
                className="flex gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-white/15 transition-smooth">
                <img src={p.image} alt={p.title} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{t(`subject.${p.subject}`)}</div>
                  <div className="flex items-center gap-1 text-xs text-[oklch(0.78_0.20_150)] mt-1">
                    <Download className="h-3 w-3" /> {t("dash.available")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Teacher / non-admin own submissions */}
      {(user.role === "teacher" || user.role === "student") && mySubmissions.length > 0 && (
        <div className="glass rounded-3xl p-6 mt-6">
          <h2 className="text-xl font-bold font-display mb-4">{t("dash.mySubmissions")}</h2>
          <div className="grid gap-3">
            {mySubmissions.map((p) => {
              const Status = p.status === "approved" ? Check : p.status === "rejected" ? X : Clock;
              const cls =
                p.status === "approved" ? "text-emerald-400 bg-emerald-500/10 border-emerald-400/30" :
                p.status === "rejected" ? "text-rose-400 bg-rose-500/10 border-rose-400/30" :
                "text-amber-400 bg-amber-500/10 border-amber-400/30";
              return (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5">
                  <img src={p.image} alt={p.title} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm line-clamp-1">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{t(`type.${p.type}`)} · {t(`subject.${p.subject}`)}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cls}`}>
                    <Status className="h-2.5 w-2.5" />
                    {t(`status.${p.status}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
