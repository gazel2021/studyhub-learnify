import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Camera, Save, KeyRound, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useUsers } from "@/lib/users";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const t = useT();
  const sessionUser = useAuth((s) => s.user);
  const updateAuth = useAuth((s) => s.login);
  const account = useUsers((s) => (sessionUser ? s.users.find((u) => u.id === sessionUser.id) : undefined));
  const updateProfile = useUsers((s) => s.updateProfile);
  const changePassword = useUsers((s) => s.changePassword);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(account?.name ?? "");
  const [bio, setBio] = useState(account?.bio ?? "");
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [country, setCountry] = useState(account?.country ?? "");
  const [avatar, setAvatar] = useState(account?.avatar ?? "");

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  if (!sessionUser || !account) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-[oklch(0.66_0.24_295)]" />
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <Link to="/auth"><Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-neon text-white">{t("common.goSignin")}</Button></Link>
      </div>
    );
  }

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) return toast.error("Max 1.5MB");
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(sessionUser.id, { name, bio, phone, country, avatar });
    updateAuth({ ...sessionUser, name });
    toast.success(t("profile.saved"));
  };

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) return toast.error(t("profile.pwMismatch"));
    const r = changePassword(sessionUser.id, curPw, newPw);
    if (r.error === "BAD_PW") return toast.error(t("auth.error.badPw"));
    if (r.error === "SHORT_PW") return toast.error(t("auth.error.shortPw"));
    if (r.error) return toast.error(r.error);
    setCurPw(""); setNewPw(""); setConfirmPw("");
    toast.success(t("profile.pwChanged"));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
          <UserIcon className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
          <span>{t("profile.title")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">{t("profile.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("profile.subtitle")}</p>

        <form onSubmit={handleSave} className="glass-strong border-gradient rounded-3xl p-6 md:p-8 mt-8 space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-20 w-20 rounded-2xl object-cover shadow-glow-blue" />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gradient-neon flex items-center justify-center text-2xl font-extrabold text-white shadow-glow-blue">
                  {(name || account.email).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
              <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => fileRef.current?.click()}>
                <Camera className="h-3.5 w-3.5 me-1.5" /> {t("profile.upload")}
              </Button>
              {avatar && (
                <Button type="button" size="sm" variant="ghost" className="text-xs text-rose-300" onClick={() => setAvatar("")}>
                  <Trash2 className="h-3 w-3 me-1" />{t("profile.removeAvatar")}
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>{t("auth.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label>{t("auth.email")}</Label>
              <Input value={account.email} disabled className="h-11 rounded-xl mt-1.5 bg-background/30 opacity-60" />
            </div>
            <div>
              <Label>{t("profile.phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label>{t("profile.country")}</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" />
            </div>
            <div className="md:col-span-2">
              <Label>{t("profile.bio")}</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="rounded-xl mt-1.5 bg-background/50" />
            </div>
          </div>

          <Button type="submit" className="h-12 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
            <Save className="h-4 w-4 me-2" /> {t("common.save")}
          </Button>
        </form>

        <form onSubmit={handleChangePw} className="glass rounded-3xl p-6 md:p-8 mt-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />
            <h2 className="text-lg font-bold">{t("profile.changePw")}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>{t("profile.currentPw")}</Label>
              <Input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" required />
            </div>
            <div>
              <Label>{t("profile.newPw")}</Label>
              <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" required />
            </div>
            <div>
              <Label>{t("profile.confirmPw")}</Label>
              <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="h-11 rounded-xl mt-1.5 bg-background/50" required />
            </div>
          </div>
          <Button type="submit" className="h-11 rounded-full bg-gradient-neon text-white font-bold">{t("common.save")}</Button>
        </form>
      </motion.div>
    </div>
  );
}
