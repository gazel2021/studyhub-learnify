import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Star, Download, ShoppingCart, Check, ArrowLeft, FileText, Globe, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add, items, purchased } = useCart();
  const navigate = useNavigate();
  const inCart = items.some((i) => i.id === product.id);
  const owned = purchased.includes(product.id);

  const handleAction = () => {
    if (product.price === 0 || owned) {
      toast.success("Download started!");
      return;
    }
    add(product);
    toast.success("Added to cart");
  };

  const related = PRODUCTS.filter((p) => p.subject === product.subject && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-smooth">
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-elegant">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            {product.badge && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold">{product.badge}</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="px-2.5 py-1 rounded-full bg-muted capitalize">{product.type}</span>
            <span>•</span>
            <span>{product.subject}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{product.title}</h1>
          <p className="mt-2 text-muted-foreground">by <span className="font-semibold text-foreground">{product.author}</span></p>

          <div className="flex items-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
            ))}
            <span className="ml-2 font-semibold">{product.rating}</span>
            <span className="text-sm text-muted-foreground">(248 reviews)</span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="glass rounded-xl p-3 text-center">
              <Globe className="h-4 w-4 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">Country</div>
              <div className="text-sm font-semibold">{product.country}</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <GraduationCap className="h-4 w-4 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">Stage</div>
              <div className="text-sm font-semibold">{product.stage}</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <FileText className="h-4 w-4 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">Format</div>
              <div className="text-sm font-semibold">PDF</div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl glass">
            <div className="flex items-center justify-between mb-4">
              {product.price === 0 ? (
                <div className="text-3xl font-bold text-success">Free</div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-gradient-brand">${product.price}</div>
                  <div className="text-xs text-muted-foreground">One-time purchase</div>
                </div>
              )}
            </div>
            {owned ? (
              <Button size="lg" className="w-full h-12 rounded-xl bg-success text-success-foreground">
                <Check className="mr-2 h-5 w-5" /> Owned — Download
              </Button>
            ) : product.price === 0 ? (
              <Button onClick={handleAction} size="lg" className="w-full h-12 rounded-xl bg-gradient-brand text-white shadow-elegant">
                <Download className="mr-2 h-5 w-5" /> Download free
              </Button>
            ) : inCart ? (
              <Button onClick={() => navigate({ to: "/cart" })} size="lg" className="w-full h-12 rounded-xl bg-gradient-brand text-white">
                Go to cart →
              </Button>
            ) : (
              <Button onClick={handleAction} size="lg" className="w-full h-12 rounded-xl bg-gradient-brand text-white shadow-elegant hover:opacity-90">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
              </Button>
            )}
            {product.type === "quiz" && (
              <Link to="/quiz/$id" params={{ id: product.id }}>
                <Button variant="outline" size="lg" className="w-full h-12 rounded-xl mt-3">Take the quiz</Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group block rounded-2xl overflow-hidden border border-border/60 bg-card shadow-soft hover:shadow-elegant transition-smooth">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-smooth" />
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.price === 0 ? "Free" : `$${p.price}`}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
