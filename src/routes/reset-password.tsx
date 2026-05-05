import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUsers } from "@/lib/users";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const t = useT();
  const navigate = useNavigate();
  const setPasswordByEmail = useUsers((s) => s.setPasswordByEmail);
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user.email;
      if (sessionEmail) {
        setEmail(sessionEmail);
        setReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session?.user.email) {
        setEmail(session?.user.email ?? "");
        setReady(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error(t("profile.pwMismatch"));
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (email) setPasswordByEmail(email, password);
    toast.success(t("auth.reset.success"));
    navigate({ to: "/auth" });
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t("auth.reset.invalid")}</h1>
        <Link to="/auth">
          <Button className="mt-6 h-12 rounded-full bg-gradient-neon px-6 font-bold text-primary-foreground">
            {t("common.goSignin")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass-strong border-gradient w-full max-w-md rounded-3xl p-6 md:p-8"
      >
        <div className="mb-6 text-center">
          <div className="glass mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            {t("auth.reset.title")}
          </div>
          <h1 className="font-display text-3xl font-bold">{t("auth.reset.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.reset.subtitle")}</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="new-password">{t("profile.newPw")}</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background/50 ps-10" required minLength={6} />
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password">{t("profile.confirmPw")}</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 rounded-xl bg-background/50 ps-10" required minLength={6} />
            </div>
          </div>
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-gradient-neon font-bold text-primary-foreground shadow-glow-blue">
            {t("common.save")}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}