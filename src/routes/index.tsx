import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, BookOpen, Users, Trophy, Zap, ShieldCheck, Globe,
  Brain, FileText, ScrollText, ChevronRight, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "@/components/ProductSlider";
import { ProductCard } from "@/components/ProductCard";
import { SUBJECTS } from "@/lib/data";
import { useProducts } from "@/lib/products";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const t = useT();
  const PRODUCTS = useProducts((s) => s.items);
  const trending = PRODUCTS.filter((p) => p.badge === "Hot" || p.rating >= 4.8);
  const latest = PRODUCTS.filter((p) => p.badge === "New").concat(PRODUCTS.slice(0, 4));

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative pt-10 md:pt-16 pb-20 md:pb-32">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-[oklch(0.68_0.22_255)]/25 blur-[120px] animate-blob" />
          <div className="absolute top-40 right-0 h-[600px] w-[600px] rounded-full bg-[oklch(0.66_0.24_295)]/25 blur-[120px] animate-blob" style={{ animationDelay: "5s" }} />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[oklch(0.72_0.25_350)]/15 blur-[120px] animate-blob" style={{ animationDelay: "10s" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-strong text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.78_0.20_150)] opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.78_0.20_150)]" />
                </span>
                <span className="text-foreground/90">{t("hero.badge")}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight font-display">
                {t("hero.title.1")}
                <br />
                {t("hero.title.2")}{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-0 blur-2xl bg-gradient-neon opacity-50" />
                  <span className="relative text-gradient-neon">{t("hero.title.3")}</span>
                </span>
                <br />
                {t("hero.title.4")}
              </h1>

              <p className="mt-7 text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/products">
                  <Button size="lg" className="relative h-13 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth animate-glow-pulse">
                    <Sparkles className="h-4 w-4 me-2" />
                    {t("hero.cta.start")}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-13 px-8 rounded-full glass border-white/20 hover:border-white/40 hover:bg-white/5 font-bold transition-smooth">
                    {t("hero.cta.teacher")}
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-3 max-w-lg">
                {[
                  { v: "10k+", l: t("hero.stat.resources"), c: "from-[oklch(0.68_0.22_255)] to-[oklch(0.82_0.16_200)]" },
                  { v: "500+", l: t("hero.stat.educators"), c: "from-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" },
                  { v: "98%", l: t("hero.stat.loved"), c: "from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)]" },
                ].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-4 text-center transition-smooth hover:shadow-glow-blue hover:-translate-y-1">
                    <div className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${s.c} bg-clip-text text-transparent font-display`}>{s.v}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — 3D AI Orb */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative aspect-square max-w-[560px] mx-auto w-full">
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 rounded-full conic-glow opacity-60 blur-2xl animate-spin-slow" />
              </div>
              <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-[oklch(0.30_0.10_265)] to-[oklch(0.16_0.025_265)] shadow-pop overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.68_0.22_255)]/30 via-transparent to-[oklch(0.66_0.24_295)]/30" />
                <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-[oklch(0.68_0.22_255)]/40 blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-[oklch(0.66_0.24_295)]/40 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-neon shadow-glow-purple flex items-center justify-center">
                      <Brain className="h-14 w-14 text-white" />
                    </div>
                  </motion.div>
                </div>
                <div className="absolute inset-6 rounded-full border border-white/10" />
                <div className="absolute inset-14 rounded-full border border-white/5" />
              </div>

              <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-4 -left-2 sm:left-0 glass-strong rounded-2xl p-3 shadow-glow-green flex items-center gap-3 z-10">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)] flex items-center justify-center shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Quiz</div>
                  <div className="text-sm font-extrabold">95% 🎯</div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-8 -right-2 sm:-right-4 glass-strong rounded-2xl p-3 shadow-glow-blue flex items-center gap-3 z-10">
                <div className="h-11 w-11 rounded-xl bg-gradient-neon flex items-center justify-center shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">PDF</div>
                  <div className="text-sm font-extrabold">Calculus</div>
                </div>
              </motion.div>

              <motion.div animate={{ x: [0, 12, 0], y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 -right-4 sm:-right-8 glass-strong rounded-xl px-3 py-2 shadow-glow-purple flex items-center gap-2 z-10">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                <div className="text-xs font-bold">4.9</div>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 font-mono">
              {t("hero.trusted")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              {["Cambridge", "MIT", "Oxford", "Stanford", "Harvard", "Yale"].map((b) => (
                <span key={b} className="text-sm font-bold tracking-wide font-display">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="h-3.5 w-3.5 text-[oklch(0.78_0.18_65)]" />
                <span>{t("section.trending.kicker")}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                {t("section.trending.title")} <span className="text-gradient-neon">{t("section.trending.title.accent")}</span>
              </h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-gradient-neon transition-smooth glass rounded-full px-4 py-2">
              {t("section.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <ProductSlider products={trending.length ? trending : PRODUCTS} />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] bg-gradient-soft opacity-50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
              {t("section.categories.kicker")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              {t("section.categories.title")} <span className="text-gradient-neon">{t("section.categories.title.accent")}</span>
            </h2>
            <p className="mt-4 text-muted-foreground">{t("section.categories.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUBJECTS.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8, scale: 1.04 }} className="relative group">
                <div className="absolute -inset-px rounded-3xl bg-gradient-neon opacity-0 group-hover:opacity-60 blur-md transition-opacity" />
                <Link to="/products" search={{ subject: s.name }} className="relative block aspect-square rounded-3xl overflow-hidden border-gradient transition-smooth">
                  <img src={s.image} alt={s.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_265)] via-[oklch(0.10_0.02_265)]/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-white font-extrabold text-sm md:text-base font-display">{s.name}</div>
                    <div className="text-white/70 text-[10px] font-mono uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      Explore <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[oklch(0.78_0.20_150)]" />
                {t("section.latest.kicker")}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                {t("section.latest.title")} <span className="text-gradient-neon">{t("section.latest.title.accent")}</span>
              </h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-gradient-neon transition-smooth glass rounded-full px-4 py-2">
              {t("section.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT TYPES */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              {t("section.types.title")} <span className="text-gradient-neon">{t("section.types.title.accent")}</span>
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: FileText, t: t("type.book.t"), d: t("type.book.d"), g: "from-[oklch(0.68_0.22_255)] to-[oklch(0.82_0.16_200)]", glow: "shadow-glow-blue" },
              { icon: ScrollText, t: t("type.exam.t"), d: t("type.exam.d"), g: "from-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]", glow: "shadow-glow-purple" },
              { icon: Brain, t: t("type.quiz.t"), d: t("type.quiz.d"), g: "from-[oklch(0.78_0.20_150)] to-[oklch(0.82_0.16_200)]", glow: "shadow-glow-green" },
            ].map((f, i) => (
              <motion.div key={f.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} className="relative group">
                <div className="absolute -inset-px rounded-3xl bg-gradient-neon opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
                <div className="relative glass-strong border-gradient rounded-3xl p-7 transition-smooth h-full">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${f.g} flex items-center justify-center ${f.glow} mb-5`}>
                    <f.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-display">{f.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: t("feat.quality.t"), d: t("feat.quality.d"), c: "text-[oklch(0.78_0.20_150)]" },
              { icon: Users, t: t("feat.educators.t"), d: t("feat.educators.d"), c: "text-[oklch(0.68_0.22_255)]" },
              { icon: Globe, t: t("feat.pi.t"), d: t("feat.pi.d"), c: "text-[oklch(0.66_0.24_295)]" },
            ].map((f, i) => (
              <motion.div key={f.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 hover:shadow-glow-blue hover:-translate-y-1 transition-smooth">
                <f.icon className={`h-8 w-8 ${f.c} mb-3`} />
                <h3 className="text-lg font-bold mb-1.5 font-display">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden glass-strong border-gradient p-10 md:p-20 text-center">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[oklch(0.68_0.22_255)]/30 blur-3xl animate-blob" />
              <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-[oklch(0.66_0.24_295)]/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
                {t("cta.kicker")}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight">
                {t("cta.title")} <span className="text-gradient-neon">{t("cta.title.accent")}</span>
              </h2>
              <p className="mt-5 text-foreground/70 max-w-2xl mx-auto text-lg">{t("cta.subtitle")}</p>
              <div className="mt-9 flex flex-wrap gap-3 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="h-13 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth">
                    <Sparkles className="h-4 w-4 me-2" />
                    {t("cta.start")}
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="h-13 px-8 rounded-full glass border-white/20 hover:border-white/40 hover:bg-white/5 font-bold transition-smooth">
                    {t("cta.browse")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
