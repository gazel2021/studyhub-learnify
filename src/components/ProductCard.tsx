import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Download, Sparkles, FileText, Brain, ScrollText, Lock, Clock } from "lucide-react";
import type { Product } from "@/lib/store";
import { useT, useI18n } from "@/lib/i18n";
import { currencyForCountry, formatCurrency } from "@/lib/currency";

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
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const currency = currencyForCountry(product.country);
  const isPending = product.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group h-full relative"
    >
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 bg-gradient-to-r from-[oklch(0.68_0.22_255)] via-[oklch(0.66_0.24_295)] to-[oklch(0.72_0.25_350)]" />

      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block h-full rounded-3xl overflow-hidden glass-strong border-gradient transition-smooth"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_265)] via-[oklch(0.10_0.02_265)]/40 to-transparent" />
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[oklch(0.66_0.24_295)] opacity-30 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />

          {product.badge && !isPending && (
            <div className={`absolute top-3 start-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${badgeStyles[product.badge]} text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1`}>
              <Sparkles className="h-2.5 w-2.5" />
              {product.badge}
            </div>
          )}
          {isPending && (
            <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {t("status.pending")}
            </div>
          )}

          <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full glass text-xs font-bold flex items-center gap-1 text-white">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            {product.rating}
          </div>

          <div className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-wider text-white">
            <Icon className="h-3 w-3" />
            {t(`type.${product.type}`)}
          </div>

          {product.price > 0 && (
            <div className="absolute bottom-3 end-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] font-bold text-white">
              <Lock className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        <div className="relative p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2 flex-wrap">
            <span className="font-medium">{t(`subject.${product.subject}`)}</span>
            <span className="opacity-50">•</span>
            <span className="opacity-80">{t(`country.${product.country}`)}</span>
            <span className="opacity-50">•</span>
            <span className="opacity-80">{t(`stage.${product.stage}`)}</span>
          </div>
          <h3 className="font-bold text-[15px] line-clamp-2 mb-1.5 leading-snug text-foreground group-hover:text-gradient-neon transition-smooth">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {t("card.by")} <span className="font-medium text-foreground/80">{product.author}</span>
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
            {product.price === 0 ? (
              <div className="flex items-center gap-1.5 text-[oklch(0.78_0.20_150)] font-bold text-sm">
                <div className="h-7 w-7 rounded-full bg-[oklch(0.78_0.20_150)]/15 flex items-center justify-center shadow-glow-green">
                  <Download className="h-3.5 w-3.5" />
                </div>
                {t("card.free")}
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-gradient-neon leading-tight">
                  {formatCurrency(product.price, currency.code, lang)}
                </span>
                <span className="text-[9px] text-muted-foreground font-mono">
                  ${product.price}
                </span>
              </div>
            )}
            {product.pages && (
              <div className="text-[10px] text-muted-foreground font-mono uppercase px-2 py-1 rounded-md bg-white/5">
                {t("card.pages", { n: product.pages })}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
