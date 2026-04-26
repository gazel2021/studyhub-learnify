import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Lock, Sparkles, ShoppingCart } from "lucide-react";
import { useProducts } from "@/lib/products";
import { useCart } from "@/lib/store";
import { useT, useI18n } from "@/lib/i18n";
import { SAMPLE_PARAGRAPHS } from "@/lib/data";
import { currencyForCountry, formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reader/$id")({
  component: ReaderPage,
});

const PREVIEW_PCT = 20;

function ReaderPage() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { id } = Route.useParams();
  const product = useProducts((s) => s.items.find((p) => p.id === id));
  const purchased = useCart((s) => s.purchased);
  const add = useCart((s) => s.add);

  if (!product) throw notFound();

  const owned = product.price === 0 || purchased.includes(product.id);
  const currency = currencyForCountry(product.country);

  // Build paragraphs (use uploaded content if available, else sample)
  const paragraphs = useMemo(() => {
    const raw = (product.content?.trim() || SAMPLE_PARAGRAPHS.join("\n\n"))
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    // Pad to at least 10 for richer reading view
    while (raw.length < 10) raw.push(...SAMPLE_PARAGRAPHS);
    return raw;
  }, [product.content]);

  const previewCount = Math.max(1, Math.ceil((paragraphs.length * PREVIEW_PCT) / 100));
  const visible = owned ? paragraphs : paragraphs.slice(0, previewCount);

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <Link
        to="/products/$id" params={{ id: product.id }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gradient-neon transition-smooth mb-6"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("detail.back")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong border-gradient rounded-3xl p-6 md:p-10">
        <div className="flex flex-wrap items-start gap-5 pb-5 border-b border-white/5">
          <img src={product.image} alt={product.title} className="h-24 w-24 rounded-2xl object-cover shadow-glow-blue" />
          <div className="flex-1 min-w-[220px]">
            <div className="text-[11px] uppercase tracking-wider font-mono text-muted-foreground mb-1">
              {t(`type.${product.type}`)} · {t(`subject.${product.subject}`)} · {t(`stage.${product.stage}`)}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-display leading-tight">{product.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("card.by")} <span className="text-foreground/90 font-medium">{product.author}</span>
            </p>
          </div>
          {!owned && (
            <div className="text-end">
              <div className="text-2xl font-extrabold text-gradient-neon">
                {formatCurrency(product.price, currency.code, lang)}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">${product.price}</div>
            </div>
          )}
        </div>

        {!owned && (
          <div className="mt-5 mb-6 rounded-2xl glass border border-amber-400/30 p-3 text-sm flex items-center gap-2 text-amber-300">
            <Sparkles className="h-4 w-4" />
            {t("reader.preview.label", { pct: PREVIEW_PCT })}
          </div>
        )}

        <article className="prose prose-invert max-w-none mt-4 space-y-5 text-base leading-loose">
          {visible.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="text-foreground/90 first:text-lg first:font-medium"
            >
              <span className="text-[10px] font-mono text-muted-foreground me-2 align-top">
                {String(i + 1).padStart(2, "0")}
              </span>
              {p}
            </motion.p>
          ))}
        </article>

        {/* Lock zone */}
        {!owned && (
          <div className="relative mt-8">
            {/* fading remaining content */}
            <div className="relative max-h-48 overflow-hidden">
              {paragraphs.slice(previewCount, previewCount + 3).map((p, i) => (
                <p key={i} className="text-foreground/40 leading-loose blur-[2px] select-none">{p}</p>
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative -mt-20 mx-auto max-w-md text-center glass-strong border-gradient rounded-3xl p-8 shadow-glow-purple"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-neon flex items-center justify-center shadow-glow-blue mb-4">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold font-display">{t("reader.locked.t")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("reader.locked.d")}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Button
                  onClick={() => add(product)}
                  className="h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth"
                >
                  <ShoppingCart className="h-4 w-4 me-2" />
                  {t("reader.unlock")} · {formatCurrency(product.price, currency.code, lang)}
                </Button>
                <Link to="/products/$id" params={{ id: product.id }}>
                  <Button variant="outline" className="w-full h-11 rounded-full">
                    <BookOpen className="h-4 w-4 me-2" />
                    {t("detail.back")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
