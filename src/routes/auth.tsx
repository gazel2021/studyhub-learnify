import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Shield, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const ROLES: { id: Role; title: string; desc: string; icon: typeof BookOpen }[] = [
  { id: "student", title: "Student", desc: "Buy and learn from premium content", icon: BookOpen },
  { id: "teacher", title: "Teacher", desc: "Sell your expertise to learners", icon: GraduationCap },
  { id: "admin", title: "Admin", desc: "Manage the platform", icon: Shield },
];

function AuthPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Please fill all fields");
    login({
      id: crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      role,
    });
    toast.success(`Welcome${name ? `, ${name}` : "!"}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "signup" ? "Join StudyHub in seconds" : "Sign in to continue learning"}
          </p>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 shadow-elegant">
          {mode === "signup" && step === 1 ? (
            <>
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Choose your role</h2>
              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-smooth flex items-center gap-4 ${
                      role === r.id ? "border-primary bg-primary/5 shadow-elegant" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${role === r.id ? "bg-gradient-brand text-white" : "bg-muted"}`}>
                      <r.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)} className="w-full mt-6 h-12 rounded-xl bg-gradient-brand text-white">
                Continue
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl" placeholder="Jane Doe" />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="pl-10 h-11 rounded-xl" placeholder="••••••••" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-brand text-white shadow-elegant">
                {mode === "signup" ? "Create account" : "Sign in"}
              </Button>
              {mode === "signup" && (
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>
                  ← Change role
                </Button>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to StudyHub?"}{" "}
            <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setStep(mode === "signup" ? 2 : 1); }} className="text-primary font-semibold hover:underline">
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
