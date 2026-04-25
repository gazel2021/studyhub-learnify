import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Download, Sparkles, FileText, Brain, ScrollText } from "lucide-react";
import type { Product } from "@/lib/store";

const badgeStyles: Record<string, string> = {
  Hot: "from-rose-500 via-pink-500 to-orange-400",
  New: "from-emerald-400 via-teal-400 to-cyan-400",
  Best: "from-amber-400 via-yellow-300 to-orange-400",
};

const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  book: FileText,
  exam: ScrollText,
  quiz: Brain,
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const Icon = typeIcon[product.type] ?? FileText;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group h-full relative"
    >
      {/* Outer glow on hover */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 bg-gradient-to-r from-[oklch(0.68_0.22_255)] via-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" />

      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block h-full rounded-3xl overflow-hidden glass-strong border-gradient transition-smooth"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Image */}
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_265)] via-[oklch(0.10_0.02_265)]/40 to-transparent" />
          {/* Neon accent corner */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[oklch(0.66_0.24_295)] opacity-30 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${badgeStyles[product.badge]} text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1`}>
              <Sparkles className="h-2.5 w-2.5" />
              {product.badge}
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass text-xs font-bold flex items-center gap-1 text-white">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            {product.rating}
          </div>

          {/* Type pill */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-white">
            <Icon className="h-3 w-3" />
            {product.type}
          </div>
        </div>

        <div className="relative p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
            <span className="font-medium">{product.subject}</span>
            <span className="opacity-50">•</span>
            <span className="opacity-80">{product.country}</span>
          </div>
          <h3 className="font-bold text-[15px] line-clamp-2 mb-1.5 leading-snug text-foreground group-hover:text-gradient-neon transition-smooth">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            by <span className="font-medium text-foreground/80">{product.author}</span>
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            {product.price === 0 ? (
              <div className="flex items-center gap-1.5 text-[oklch(0.78_0.20_150)] font-bold text-sm">
                <div className="h-7 w-7 rounded-full bg-[oklch(0.78_0.20_150)]/15 flex items-center justify-center shadow-glow-green">
                  <Download className="h-3.5 w-3.5" />
                </div>
                Free
              </div>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-[10px] text-muted-foreground font-medium">$</span>
                <span className="text-2xl font-extrabold text-gradient-neon">{product.price}</span>
              </div>
            )}
            <div className="text-[10px] text-muted-foreground font-mono uppercase px-2 py-1 rounded-md bg-white/5">
              {product.stage}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
