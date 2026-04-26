import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { useT, useI18n } from "@/lib/i18n";
import { currencyForCountry, formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { items, remove } = useCart();
  const navigate = useNavigate();
  const totalUsd = items.reduce((s, i) => s + i.price, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-full glass-strong flex items-center justify-center mb-6 shadow-glow-blue">
          <ShoppingBag className="h-10 w-10 text-[oklch(0.68_0.22_255)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display">{t("cart.empty.t")}</h1>
        <p className="mt-2 text-muted-foreground">{t("cart.empty.d")}</p>
        <Link to="/products">
          <Button className="mt-6 h-12 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:scale-105 transition-smooth">
            {t("cart.explore")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold font-display mb-8">
        {t("cart.title", { n: items.length })}
      </h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((p, i) => {
            const cur = currencyForCountry(p.country);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl glass border border-white/5"
              >
                <img src={p.image} alt={p.title} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{t("card.by")} {p.author}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-gradient-neon">
                      {formatCurrency(p.price, cur.code, lang)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">${p.price}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="rounded-full text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
        <div className="h-fit glass-strong border-gradient rounded-3xl p-6 sticky top-24">
          <h2 className="font-bold text-lg font-display mb-4">{t("cart.summary")}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>${totalUsd.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>{t("cart.tax")}</span><span>$0.00</span></div>
          </div>
          <div className="border-t border-white/10 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>{t("cart.total")}</span>
            <span className="text-gradient-neon">${totalUsd.toFixed(2)}</span>
          </div>
          <Button onClick={() => navigate({ to: "/checkout" })} className="w-full mt-6 h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth">
            {t("cart.checkout")} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
