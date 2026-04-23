import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, remove } = useCart();
  const navigate = useNavigate();
  const total = items.reduce((s, i) => s + i.price, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-full glass flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse the catalog to find your next learning resource.</p>
        <Link to="/products">
          <Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-brand text-white">Explore resources</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your cart ({items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-soft">
              <img src={p.image} alt={p.title} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground">by {p.author}</p>
                <div className="text-lg font-bold text-gradient-brand mt-2">${p.price}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <div className="h-fit glass rounded-2xl p-6 sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>$0.00</span></div>
          </div>
          <div className="border-t border-border/60 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-gradient-brand">${total.toFixed(2)}</span>
          </div>
          <Button onClick={() => navigate({ to: "/checkout" })} className="w-full mt-6 h-12 rounded-xl bg-gradient-brand text-white shadow-elegant">
            Proceed to checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
