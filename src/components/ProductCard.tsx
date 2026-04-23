import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Download, Lock } from "lucide-react";
import type { Product } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const badgeStyles: Record<string, string> = {
  Hot: "bg-destructive text-destructive-foreground",
  New: "bg-success text-success-foreground",
  Best: "bg-accent text-accent-foreground",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="block h-full rounded-2xl bg-card border border-border/60 overflow-hidden shadow-soft hover:shadow-elegant transition-smooth"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-110"
          />
          {product.badge && (
            <Badge className={`absolute top-3 left-3 ${badgeStyles[product.badge]} border-0 shadow-md`}>
              {product.badge}
            </Badge>
          )}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass text-xs font-semibold flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {product.rating}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="px-2 py-0.5 rounded-full bg-muted capitalize">{product.type}</span>
            <span>•</span>
            <span>{product.subject}</span>
          </div>
          <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-smooth">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">by {product.author}</p>
          <div className="flex items-center justify-between">
            {product.price === 0 ? (
              <div className="flex items-center gap-1 text-success font-bold">
                <Download className="h-4 w-4" />
                Free
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-lg font-bold text-gradient-brand">${product.price}</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">{product.country}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
