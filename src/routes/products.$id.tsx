import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Star,
  BookOpen,
  ShoppingCart,
  Check,
  ArrowLeft,
  FileText,
  Globe,
  GraduationCap,
  Lock,
  Eye,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProducts, selectApproved } from "@/lib/products";
import { useCart, useAuth } from "@/lib/store";
import { useT, useI18n } from "@/lib/i18n";
import { currencyForCountry, formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const { id } = Route.useParams();
  const product = useProducts((s) => s.items.find((p) => p.id === id));
  const all = useProducts((s) => s.items);
  const { add, items, purchased } = useCart();
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  if (!product) throw notFound();

  // Pending products are only visible to owner or admin
  if (product.status !== "approved" && user?.id !== product.ownerId && user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Clock className="h-16 w-16 mx-auto mb-4 text-amber-400" />
        <h1 className="text-2xl font-bold font-display">{t("detail.pending.t")}</h1>
        <p className="text-muted-foreground mt-2">{t("detail.pending.d")}</p>
        <Link to="/products">
          <Button className="mt-6 h-12 px-6 rounded-full bg-gradient-neon text-white">
            {t("detail.back")}
          </Button>
        </Link>
      </div>
    );
  }

  const inCart = items.some((i) => i.id === product.id);
  const owned = product.price === 0 || purchased.includes(product.id);
  const currency = currencyForCountry(product.country);

  const handleBuyNow = () => {
    if (!items.some((i) => i.id === product.id)) {
      add(product);
      toast.success(t("common.added"));
    }
    navigate({ to: "/checkout" });
  };

  const related = selectApproved(all)
    .filter((p) => p.subject === product.subject && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gradient-neon transition-smooth mb-6"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("detail.back")}
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-glow-blue">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            {product.badge && (
              <div className="absolute top-4 start-4 px-3 py-1 rounded-full bg-gradient-neon text-white text-xs font-extrabold uppercase">
                {product.badge}
              </div>
            )}
            {product.status === "pending" && (
              <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-extrabold uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t("status.pending")}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-full glass">{t(`type.${product.type}`)}</span>
            <span className="px-2.5 py-1 rounded-full glass">
              {t(`subject.${product.subject}`)}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight font-display">
            {product.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("card.by")} <span className="font-semibold text-foreground">{product.author}</span>
          </p>

          <div className="flex items-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-300 text-amber-300" : "text-muted"}`}
              />
            ))}
            <span className="ms-2 font-semibold">{product.rating}</span>
            <span className="text-sm text-muted-foreground">{t("detail.reviews", { n: 248 })}</span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Info
              icon={Globe}
              label={t("detail.country")}
              value={t(`country.${product.country}`)}
            />
            <Info
              icon={GraduationCap}
              label={t("detail.stage")}
              value={t(`stage.${product.stage}`)}
            />
            <Info icon={FileText} label={t("detail.format")} value="PDF" />
          </div>

          <div className="mt-8 p-6 rounded-3xl glass-strong border-gradient">
            <div className="flex items-center justify-between mb-4">
              {product.price === 0 ? (
                <div className="text-3xl font-extrabold text-[oklch(0.78_0.20_150)] font-display">
                  {t("card.free")}
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-extrabold text-gradient-neon font-display">
                    {formatCurrency(product.price, currency.code, lang)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                    ${product.price} · {t("detail.oneTime")}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              {owned ? (
                <Link to="/reader/$id" params={{ id: product.id }}>
                  <Button
                    size="lg"
                    className="w-full h-13 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth"
                  >
                    <Check className="me-2 h-5 w-5" /> {t("detail.owned")}
                  </Button>
                </Link>
              ) : (
                <>
                  {inCart ? (
                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="w-full h-13 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue"
                    >
                      {t("checkout.payNow")} →
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="w-full h-13 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth"
                    >
                      <ShoppingCart className="me-2 h-5 w-5" /> {t("detail.buyNow")}
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={() => navigate({ to: "/reader/$id", params: { id: product.id } })}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 rounded-full glass border-white/20 hover:bg-white/5"
                  >
                    <Eye className="me-2 h-4 w-4" /> {t("detail.preview")}
                    <Lock className="ms-2 h-3.5 w-3.5 opacity-60" />
                  </Button>
                </>
              )}

              {product.type === "quiz" && owned && (
                <Link to="/quiz/$id" params={{ id: product.id }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12 rounded-full glass border-white/20"
                  >
                    {t("detail.takeQuiz")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[oklch(0.68_0.22_255)]" />
            {t("detail.related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => {
              const cur = currencyForCountry(p.country);
              return (
                <Link
                  key={p.id}
                  to="/products/$id"
                  params={{ id: p.id }}
                  className="group block rounded-3xl overflow-hidden glass-strong border-gradient hover:shadow-glow-blue transition-smooth"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm line-clamp-1 group-hover:text-gradient-neon">
                      {p.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.price === 0 ? t("card.free") : formatCurrency(p.price, cur.code, lang)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <Icon className="h-4 w-4 mx-auto text-[oklch(0.68_0.22_255)] mb-1" />
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
        {label}
      </div>
      <div className="text-sm font-bold mt-0.5">{value}</div>
    </div>
  );
}
