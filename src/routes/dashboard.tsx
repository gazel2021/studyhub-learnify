import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, DollarSign, Users, TrendingUp, Plus, Download } from "lucide-react";
import { useAuth, useCart } from "@/lib/store";
import { PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const user = useAuth((s) => s.user);
  const purchased = useCart((s) => s.purchased);
  const ownedProducts = PRODUCTS.filter((p) => purchased.includes(p.id));

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="text-muted-foreground mt-2">Please sign in to access your dashboard.</p>
        <Link to="/auth">
          <Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-brand text-white">Sign in</Button>
        </Link>
      </div>
    );
  }

  const stats =
    user.role === "student"
      ? [
          { label: "Owned items", value: ownedProducts.length, icon: BookOpen, color: "from-blue-500 to-cyan-500" },
          { label: "Quizzes taken", value: 12, icon: TrendingUp, color: "from-purple-500 to-pink-500" },
          { label: "Avg score", value: "87%", icon: DollarSign, color: "from-green-500 to-emerald-500" },
        ]
      : user.role === "teacher"
      ? [
          { label: "Products", value: 8, icon: BookOpen, color: "from-blue-500 to-cyan-500" },
          { label: "Total sales", value: "342", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
          { label: "Earnings", value: "$2,840", icon: DollarSign, color: "from-green-500 to-emerald-500" },
        ]
      : [
          { label: "Total users", value: "12.4k", icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "Products", value: PRODUCTS.length, icon: BookOpen, color: "from-purple-500 to-pink-500" },
          { label: "Revenue", value: "$48k", icon: DollarSign, color: "from-green-500 to-emerald-500" },
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground capitalize">{user.role} dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {user.name} 👋</h1>
        </div>
        {(user.role === "teacher" || user.role === "admin") && (
          <Button className="h-11 rounded-xl bg-gradient-brand text-white shadow-elegant">
            <Plus className="h-4 w-4 mr-2" /> New product
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <div className="text-3xl font-bold mt-1">{s.value}</div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-elegant`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {user.role === "student" ? "Your library" : user.role === "teacher" ? "Your products" : "Recent products"}
        </h2>
        {ownedProducts.length === 0 && user.role === "student" ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your library is empty.</p>
            <Link to="/products">
              <Button className="bg-gradient-brand text-white rounded-xl">Browse resources</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(user.role === "student" ? ownedProducts : PRODUCTS.slice(0, 6)).map((p) => (
              <Link
                key={p.id}
                to="/products/$id"
                params={{ id: p.id }}
                className="flex gap-3 p-3 rounded-xl bg-card border border-border/60 hover:shadow-elegant transition-smooth"
              >
                <img src={p.image} alt={p.title} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{p.subject}</div>
                  <div className="flex items-center gap-1 text-xs text-success mt-1">
                    <Download className="h-3 w-3" /> Available
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
