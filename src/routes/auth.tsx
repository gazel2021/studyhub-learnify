import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Shield, Mail, Lock, User, Sparkles, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/store";
import { useUsers } from "@/lib/users";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Step = "role" | "form" | "otp";

type PendingSignup = { name: string; password: string; role: Role };

function pendingKey(email: string) {
  return `studyhub-pending-signup:${email.toLowerCase()}`;
}

function readPendingSignup(email: string): PendingSignup | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(pendingKey(email));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingSignup;
  } catch {
    return null;
  }
}

function savePendingSignup(email: string, data: PendingSignup) {
  if (typeof window === "undefined") return;
  localStorage.setItem(pendingKey(email), JSON.stringify(data));
}

function clearPendingSignup(email: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(pendingKey(email));
}

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const startSignup = useUsers((s) => s.startSignup);
  const verifyOtp = useUsers((s) => s.verifyOtp);
  const resendOtp = useUsers((s) => s.resendOtp);
  const signIn = useUsers((s) => s.signIn);
  const upsertVerifiedUser = useUsers((s) => s.upsertVerifiedUser);

  const [mode, setMode] = useState<"signup" | "login" | "forgot">("signup");
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const cloudUser = data.session?.user;
      if (!cloudUser?.email) return;
      const pending = readPendingSignup(cloudUser.email);
      const meta = cloudUser.user_metadata as { name?: string; role?: Role };
      const account = upsertVerifiedUser({
        id: cloudUser.id,
        name: pending?.name || meta.name || cloudUser.email.split("@")[0],
        email: cloudUser.email,
        password: pending?.password,
        role: pending?.role || meta.role || "student",
      });
      clearPendingSignup(cloudUser.email);
      login({ id: account.id, name: account.name, email: account.email, role: account.role });
    });
  }, [login, upsertVerifiedUser]);

  const ROLES: { id: Role; title: string; desc: string; icon: typeof BookOpen }[] = [
    { id: "student", title: t("auth.role.student.t"), desc: t("auth.role.student.d"), icon: BookOpen },
    { id: "teacher", title: t("auth.role.teacher.t"), desc: t("auth.role.teacher.d"), icon: GraduationCap },
    { id: "admin", title: t("auth.role.admin.t"), desc: t("auth.role.admin.d"), icon: Shield },
  ];

  const errMsg = (e?: string) => {
    const map: Record<string, string> = {
      EMAIL_EXISTS: t("auth.error.exists"),
      BAD_EMAIL: t("auth.error.badEmail"),
      SHORT_PW: t("auth.error.shortPw"),
      NOT_FOUND: t("auth.error.notFound"),
      NOT_VERIFIED: t("auth.error.notVerified"),
      DISABLED: t("auth.error.disabled"),
      BAD_PW: t("auth.error.badPw"),
      BAD_CODE: t("auth.otp.bad"),
      EXPIRED: t("auth.otp.expired"),
      NO_PENDING: t("auth.otp.noPending"),
    };
    return e ? map[e] ?? e : "";
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pw) return toast.error(t("auth.fillAll"));
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: { name, role },
      },
    });
    setBusy(false);
    if (error) {
      const fallback = startSignup({ name, email, password: pw, role });
      if (fallback.error) return toast.error(error.message || errMsg(fallback.error));
      setStep("otp");
      return toast.success(t("auth.otp.sent", { code: fallback.code }), { duration: 10_000 });
    }
    savePendingSignup(email, { name, password: pw, role });
    setStep("otp");
    toast.success(t("auth.email.sent"));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return toast.error(t("auth.fillAll"));
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (!error && data.user) {
      const meta = data.user.user_metadata as { name?: string; role?: Role };
      const account = upsertVerifiedUser({
        id: data.user.id,
        name: meta.name || data.user.email?.split("@")[0] || "User",
        email: data.user.email || email,
        password: pw,
        role: meta.role || "student",
      });
      login({ id: account.id, name: account.name, email: account.email, role: account.role });
      toast.success(`${t("auth.welcome")}، ${account.name}`);
      navigate({ to: account.role === "admin" ? "/admin" : "/dashboard" });
      return;
    }
    const r = signIn(email, pw);
    if (r.error || !r.user) return toast.error(errMsg(r.error));
    login({ id: r.user.id, name: r.user.name, email: r.user.email, role: r.user.role });
    toast.success(`${t("auth.welcome")}، ${r.user.name}`);
    navigate({ to: r.user.role === "admin" ? "/admin" : "/dashboard" });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error(t("auth.error.badEmail"));
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t("auth.forgot.sent"));
    setMode("login");
    setStep("form");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "signup",
    });
    setBusy(false);
    if (!error && data.user?.email) {
      const pending = readPendingSignup(data.user.email);
      const meta = data.user.user_metadata as { name?: string; role?: Role };
      const account = upsertVerifiedUser({
        id: data.user.id,
        name: pending?.name || meta.name || data.user.email.split("@")[0],
        email: data.user.email,
        password: pending?.password,
        role: pending?.role || meta.role || "student",
      });
      clearPendingSignup(data.user.email);
      login({ id: account.id, name: account.name, email: account.email, role: account.role });
      toast.success(`${t("auth.welcome")}، ${account.name}`);
      navigate({ to: account.role === "admin" ? "/admin" : "/dashboard" });
      return;
    }
    const r = verifyOtp(email, otpCode);
    if (r.error || !r.user) return toast.error(errMsg(r.error));
    login({ id: r.user.id, name: r.user.name, email: r.user.email, role: r.user.role });
    toast.success(`${t("auth.welcome")}، ${r.user.name}`);
    navigate({ to: r.user.role === "admin" ? "/admin" : "/dashboard" });
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    if (!error) return toast.success(t("auth.email.sent"));
    const r = resendOtp(email);
    if (r.error) return toast.error(errMsg(r.error));
    toast.success(t("auth.otp.resent", { code: r.code }), { duration: 10_000 });
  };

  const useDemoAdmin = () => {
    setMode("login");
    setStep("form");
    setEmail("owner@studyhub.app");
    setPw("owner123");
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
            {step === "otp"
              ? t("auth.otp.title")
              : mode === "forgot"
              ? t("auth.forgot.title")
              : mode === "signup"
              ? t("auth.signup.title")
              : t("auth.signin.title")}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {step === "otp"
              ? t("auth.otp.subtitle", { email })
              : mode === "forgot"
              ? t("auth.forgot.subtitle")
              : mode === "signup"
              ? t("auth.signup.subtitle")
              : t("auth.signin.subtitle")}
          </p>
        </div>

        <div className="glass-strong border-gradient rounded-3xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* SIGN-UP STEP 1: ROLE */}
            {mode === "signup" && step === "role" && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                <Button onClick={() => setStep("form")} className="w-full mt-6 h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
                  {t("auth.continue")}
                </Button>
              </motion.div>
            )}

            {/* SIGN-UP STEP 2 / LOGIN: form */}
            {step === "form" && mode !== "forgot" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={mode === "signup" ? handleSignupSubmit : handleLoginSubmit}
                className="space-y-4"
              >
                {mode === "signup" && (
                  <div>
                    <Label htmlFor="name">{t("auth.name")}</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" required />
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pw">{t("auth.password")}</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="pw" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={pw} onChange={(e) => setPw(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" placeholder="••••••••" required />
                  </div>
                </div>
                <Button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple transition-smooth">
                  {mode === "signup" ? t("auth.create") : t("auth.signin")}
                </Button>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="block w-full text-center text-sm font-semibold text-gradient-neon hover:opacity-80"
                  >
                    {t("auth.forgot.link")}
                  </button>
                )}
                {mode === "signup" && (
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("role")}>
                    {t("auth.changeRole")}
                  </Button>
                )}

                {mode === "login" && (
                  <button type="button" onClick={useDemoAdmin}
                    className="block w-full text-center text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                    🛡 {t("auth.useDemo")}: owner@studyhub.app / owner123
                  </button>
                )}
              </motion.form>
            )}

            {mode === "forgot" && (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleForgotSubmit}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="forgot-email">{t("auth.email")}</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ps-10 h-11 rounded-xl bg-background/50" placeholder="you@example.com" required />
                  </div>
                </div>
                <Button type="submit" disabled={busy} className="w-full h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
                  {t("auth.forgot.send")}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setMode("login"); setStep("form"); }}>
                  <ArrowLeft className="h-3.5 w-3.5 me-1" /> {t("auth.back")}
                </Button>
              </motion.form>
            )}

            {/* OTP step */}
            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify}
                className="space-y-4"
              >
                <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-3 text-xs text-amber-300">
                  ⚠️ {t("auth.otp.demoNote")}
                </div>
                <div>
                  <Label htmlFor="otp">{t("auth.otp.code")}</Label>
                  <div className="relative mt-1.5">
                    <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp" inputMode="numeric" maxLength={6}
                      value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="ps-10 h-12 text-center text-2xl tracking-[0.5em] font-mono rounded-xl bg-background/50"
                      placeholder="------" required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
                  {t("auth.otp.verify")}
                </Button>
                <div className="flex justify-between">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStep("form")}>
                    <ArrowLeft className="h-3.5 w-3.5 me-1" /> {t("auth.back")}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleResend}>
                    {t("auth.otp.resend")}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {step !== "otp" && mode !== "forgot" && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setStep(mode === "signup" ? "form" : "role");
                  setOtpCode("");
                }}
                className="text-gradient-neon font-bold hover:opacity-80"
              >
                {mode === "signup" ? t("auth.signin") : t("auth.create")}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← {t("common.backHome")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
