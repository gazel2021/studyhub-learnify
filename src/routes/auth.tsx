import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Shield, Mail, Lock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const t = useT();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const ROLES: { id: Role; title: string; desc: string; icon: typeof BookOpen }[] = [
    { id: "student", title: t("auth.role.student.t"), desc: t("auth.role.student.d"), icon: BookOpen },
    { id: "teacher", title: t("auth.role.teacher.t"), desc: t("auth.role.teacher.d"), icon: GraduationCap },
    { id: "admin", title: t("auth.role.admin.t"), desc: t("auth.role.admin.d"), icon: Shield },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return toast.error(t("auth.fillAll"));
    login({
      id: crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      role,
    });
    toast.success(`${t("auth.welcome")}${name ? `، ${name}` : "!"}`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 start-1/4 h-[500px] w-[500px] rounded-full bg-[oklch(0.68_0.22_255)]/20 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute bottom-0 end-1/4 h-[400px] w-[400px] rounded-full bg-[oklch(0.66_0.24_295)]/20 blur-[120px] animate-blob" style={{ animationDelay: "5s" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
            StudyHub
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display">
            {mode === "signup" ? t("auth.signup.title") : t("auth.signin.title")}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "signup" ? t("auth.signup.subtitle") : t("auth.signin.subtitle")}
          </p>
        </div>

        <div className="glass-strong border-gradient rounded-3xl p-6 md:p-8">
          {mode === "signup" && step === 1 ? (
            <>
              <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                {t("auth.role.title")}
              </h2>
              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`w-full text-start p-4 rounded-2xl border-2 transition-smooth flex items-center gap-4 ${
                      role === r.id
                        ? "border-[oklch(0.68_0.22_255)]/60 bg-white/5 shadow-glow-blue"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                      role === r.id ? "bg-gradient-neon text-white shadow-glow-blue" : "bg-white/5 text-muted-foreground"
                    }`}>
                      <r.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)} className="w-full mt-6 h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
                {t("auth.continue")}
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">{t("auth.name")}</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" />
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <Label htmlFor="pw">{t("auth.password")}</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" placeholder="••••••••" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple transition-smooth">
                {mode === "signup" ? t("auth.create") : t("auth.signin")}
              </Button>
              {mode === "signup" && (
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>
                  {t("auth.changeRole")}
                </Button>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setStep(mode === "signup" ? 2 : 1); }}
              className="text-gradient-neon font-bold hover:opacity-80"
            >
              {mode === "signup" ? t("auth.signin") : t("auth.create")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
