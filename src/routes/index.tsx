import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Users, Trophy, Zap, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "@/components/ProductSlider";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, SUBJECTS } from "@/lib/data";
import heroImg from "@/assets/hero-illustration.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const trending = PRODUCTS.filter((p) => p.badge === "Hot" || p.rating >= 4.8);
  const latest = PRODUCTS.filter((p) => p.badge === "New").concat(PRODUCTS.slice(0, 4));

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/30 to-violet-400/30 blur-3xl animate-blob" />
          <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400/30 to-amber-300/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-300/30 to-emerald-300/30 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-12 md:pt-20 pb-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-xs font-semibold text-primary mb-6 shadow-soft">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted by 50,000+ learners worldwide
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Learn smarter with
                <br />
                <span className="text-gradient-pop">premium content</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Discover thousands of curated PDFs, mock exams and interactive quizzes from top educators — all in one beautifully designed platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products">
                  <Button size="lg" className="bg-gradient-brand text-white shadow-elegant hover:shadow-glow hover:scale-105 transition-smooth h-12 px-7 rounded-2xl font-bold">
                    Start exploring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-12 px-7 rounded-2xl border-2 hover:bg-gradient-soft hover:border-primary transition-smooth font-bold">
                    Become a teacher
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { v: "10k+", l: "Resources" },
                  { v: "500+", l: "Educators" },
                  { v: "98%", l: "Satisfaction" },
                ].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-3 text-center shadow-soft">
                    <div className="text-2xl md:text-3xl font-extrabold text-gradient-pop">{s.v}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-gradient-brand opacity-30 blur-3xl rounded-full" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-glow border border-white/40">
                <img src={heroImg} alt="Learning illustration" width={1280} height={960} className="w-full h-auto" />
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 top-10 glass-strong rounded-2xl p-3 shadow-pop flex items-center gap-3"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Quiz completed</div>
                  <div className="text-sm font-extrabold">95% Score 🎉</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-4 bottom-10 glass-strong rounded-2xl p-3 shadow-pop flex items-center gap-3"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">New resource</div>
                  <div className="text-sm font-extrabold">Calculus PDF</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending slider */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <Zap className="h-4 w-4" /> Trending Now
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Most popular this week</h2>
            </div>
            <Link to="/products" className="hidden md:inline-flex items-center text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductSlider products={trending.length ? trending : PRODUCTS} />
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-soft opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-xs font-bold text-primary mb-3 shadow-soft uppercase tracking-wider">
              Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Browse by <span className="text-gradient-pop">subject</span></h2>
            <p className="mt-3 text-muted-foreground">Find content tailored to your area of study.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUBJECTS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <Link
                  to="/products"
                  search={{ subject: s.name }}
                  className="group block aspect-square rounded-3xl overflow-hidden relative shadow-soft hover:shadow-pop transition-smooth border border-white/40"
                >
                  <img src={s.image} alt={s.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 via-purple-900/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <div className="text-white font-extrabold text-sm md:text-base drop-shadow-lg">{s.name}</div>
                    <div className="text-white/80 text-[10px] font-medium mt-0.5">Explore →</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Latest additions</h2>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latest.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Verified Quality", d: "Every resource is reviewed by our expert team.", g: "from-emerald-400 to-teal-500" },
              { icon: Users, t: "Top Educators", d: "Learn from the best teachers around the world.", g: "from-blue-500 to-violet-500" },
              { icon: Globe, t: "Pi Network Ready", d: "Pay with USD, local currency or Pi cryptocurrency.", g: "from-pink-500 to-orange-400" },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-strong rounded-3xl p-6 shadow-soft hover:shadow-pop transition-smooth"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${f.g} flex items-center justify-center shadow-elegant mb-4`}>
                  <f.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-extrabold mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-brand p-8 md:p-16 text-center shadow-glow">
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 20%, white 0%, transparent 50%), radial-gradient(circle at 70% 80%, white 0%, transparent 50%)" }} />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">Ready to level up?</h2>
              <p className="mt-4 text-white/90 max-w-2xl mx-auto text-lg">
                Join thousands of learners and educators building the future of education.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="h-12 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-bold">
                    Get started free
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl bg-transparent border-2 border-white text-white hover:bg-white/10">
                    Browse catalog
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
