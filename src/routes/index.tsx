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
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-12 md:pt-20 pb-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted by 50,000+ learners worldwide
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Learn smarter with
                <br />
                <span className="text-gradient-brand">premium content</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Discover thousands of curated PDFs, mock exams and interactive quizzes from top educators — all in one beautifully designed platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/products">
                  <Button size="lg" className="bg-gradient-brand text-white shadow-elegant hover:opacity-90 transition-smooth h-12 px-7 rounded-xl">
                    Start exploring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="h-12 px-7 rounded-xl border-2">
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
                  <div key={s.l}>
                    <div className="text-2xl md:text-3xl font-bold text-gradient-brand">{s.v}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
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
              <div className="absolute -inset-8 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
              <div className="relative rounded-3xl overflow-hidden shadow-glow border border-border/50">
                <img src={heroImg} alt="Learning illustration" width={1280} height={960} className="w-full h-auto" />
              </div>
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 top-10 glass rounded-2xl p-3 shadow-elegant flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Quiz completed</div>
                  <div className="text-sm font-bold">95% Score</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -right-4 bottom-10 glass rounded-2xl p-3 shadow-elegant flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">New resource</div>
                  <div className="text-sm font-bold">Calculus PDF</div>
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
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Browse by subject</h2>
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
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  to="/products"
                  search={{ subject: s.name }}
                  className="group block aspect-square rounded-2xl overflow-hidden relative shadow-soft hover:shadow-elegant transition-smooth"
                >
                  <img src={s.image} alt={s.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="text-white font-bold text-sm md:text-base">{s.name}</div>
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
              { icon: ShieldCheck, t: "Verified Quality", d: "Every resource is reviewed by our expert team." },
              { icon: Users, t: "Top Educators", d: "Learn from the best teachers around the world." },
              { icon: Globe, t: "Pi Network Ready", d: "Pay with USD, local currency or Pi cryptocurrency." },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-elegant mb-4">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
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
