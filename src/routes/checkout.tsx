import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Globe, Wallet } from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const METHODS = [
  { id: "pi", name: "Pi Network", desc: "Pay with Pi cryptocurrency", icon: Globe },
  { id: "card", name: "Credit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "local", name: "Local Payment", desc: "Bank transfer or wallet", icon: Wallet },
];

function CheckoutPage() {
  const { items, purchase } = useCart();
  const [method, setMethod] = useState("pi");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const total = items.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    setTimeout(() => {
      purchase();
      setDone(true);
      toast.success("Payment successful!");
    }, 1200);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mx-auto h-24 w-24 rounded-full bg-success flex items-center justify-center shadow-glow"
        >
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl font-bold mt-6">Payment successful!</h1>
        <p className="text-muted-foreground mt-2">Your resources are ready in your dashboard.</p>
        <Button onClick={() => navigate({ to: "/dashboard" })} className="mt-6 h-12 px-6 rounded-xl bg-gradient-brand text-white">
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="font-semibold mb-3">Choose payment method</h2>
          <div className="space-y-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-smooth ${
                  method === m.id ? "border-primary bg-primary/5 shadow-elegant" : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${method === m.id ? "bg-gradient-brand text-white" : "bg-muted"}`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                {method === m.id && <Check className="h-5 w-5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
        <div className="h-fit glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="line-clamp-1 mr-2">{i.title}</span>
                <span className="font-semibold">${i.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-gradient-brand">${total.toFixed(2)}</span>
          </div>
          <Button onClick={handlePay} className="w-full mt-6 h-12 rounded-xl bg-gradient-brand text-white shadow-elegant">
            Pay ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
