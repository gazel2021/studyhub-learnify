import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Download, Lock } from "lucide-react";
import type { Product } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const badgeStyles: Record<string, string> = {
  Hot: "bg-gradient-to-r from-rose-500 to-orange-400 text-white",
  New: "bg-gradient-to-r from-emerald-400 to-teal-400 text-white",
  Best: "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block h-full rounded-3xl bg-card border border-border/60 overflow-hidden shadow-soft hover:shadow-pop transition-smooth"
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-soft" />

        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

          {product.badge && (
            <Badge className={`absolute top-3 left-3 ${badgeStyles[product.badge]} border-0 shadow-md px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide uppercase`}>
              {product.badge}
            </Badge>
          )}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-strong text-xs font-bold flex items-center gap-1 shadow-soft">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {product.rating}
          </div>
        </div>

        <div className="relative p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2.5">
            <span className="px-2.5 py-1 rounded-full bg-gradient-soft font-semibold text-primary capitalize">{product.type}</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="font-medium">{product.subject}</span>
          </div>
          <h3 className="font-bold text-[15px] line-clamp-2 mb-1.5 leading-snug group-hover:text-primary transition-smooth">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">by <span className="font-medium text-foreground/70">{product.author}</span></p>
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            {product.price === 0 ? (
              <div className="flex items-center gap-1.5 text-success font-bold text-sm">
                <div className="h-7 w-7 rounded-full bg-success/15 flex items-center justify-center">
                  <Download className="h-3.5 w-3.5" />
                </div>
                Free
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xl font-extrabold text-gradient-pop">${product.price}</span>
              </div>
            )}
            <span className="text-[11px] text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-muted/60">{product.country}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
