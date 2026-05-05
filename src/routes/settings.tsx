import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Image as ImageIcon, FileText, Globe, GraduationCap, BookOpen, Tag, Plus, Trash2, Shield, ShieldAlert, UserPlus, UserCog, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useUsers, hasPermission, ALL_PERMISSIONS, type Permission } from "@/lib/users";
import { useSettings } from "@/lib/settings";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { SUBJECTS, COUNTRIES, STAGES } from "@/lib/data";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const t = useT();
  const sessionUser = useAuth((s) => s.user);
  const account = useUsers((s) => (sessionUser ? s.users.find((u) => u.id === sessionUser.id) : undefined));
  const s = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);

  const cloudAdmin = sessionUser?.role === "admin" && !account;
  const canSettings = cloudAdmin || hasPermission(account, "manage_settings");
  const canPages = cloudAdmin || hasPermission(account, "edit_pages");
  const canTax = cloudAdmin || hasPermission(account, "manage_taxonomy");
  const canUsers = cloudAdmin || hasPermission(account, "manage_users");

  if (!sessionUser || sessionUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-rose-400" />
        <h1 className="text-2xl font-bold">{t("admin.denied")}</h1>
        <Link to="/auth"><Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-neon text-white">{t("common.goSignin")}</Button></Link>
      </div>
    );
  }

  if (!canSettings && !canPages && !canTax && !canUsers) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-amber-400" />
        <h1 className="text-2xl font-bold">{t("nav.permissionDenied")}</h1>
      </div>
    );
  }

  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) return toast.error("Max 1MB");
    const reader = new FileReader();
    reader.onload = () => { s.setLogo(String(reader.result)); toast.success(t("profile.saved")); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
          <SettingsIcon className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
          <span>{t("nav.settings")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">{t("settings.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("settings.subtitle")}</p>
      </motion.div>

      <Tabs defaultValue={canSettings ? "brand" : canPages ? "pages" : canTax ? "tax" : "admins"}>
        <TabsList className="glass rounded-full p-1 mb-6 flex-wrap h-auto">
          {canSettings && <TabsTrigger value="brand" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white"><ImageIcon className="h-3.5 w-3.5 me-1.5" />{t("settings.brand")}</TabsTrigger>}
          {canPages && <TabsTrigger value="pages" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white"><FileText className="h-3.5 w-3.5 me-1.5" />{t("settings.pages")}</TabsTrigger>}
          {canTax && <TabsTrigger value="tax" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white"><Tag className="h-3.5 w-3.5 me-1.5" />{t("settings.taxonomy")}</TabsTrigger>}
          {canUsers && <TabsTrigger value="admins" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white"><Shield className="h-3.5 w-3.5 me-1.5" />{t("settings.admins")}</TabsTrigger>}
          {canUsers && <TabsTrigger value="users" className="rounded-full data-[state=active]:bg-gradient-neon data-[state=active]:text-white"><UserCog className="h-3.5 w-3.5 me-1.5" />{t("settings.users")}</TabsTrigger>}
        </TabsList>

        {/* Brand */}
        {canSettings && (
          <TabsContent value="brand">
            <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <Label>{t("settings.appName")}</Label>
                <Input value={s.appName} onChange={(e) => s.setAppName(e.target.value)} className="h-11 rounded-xl mt-1.5 max-w-md bg-background/50" />
              </div>
              <div>
                <Label className="block mb-2">{t("settings.logo")}</Label>
                <div className="flex items-center gap-5">
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt="logo" className="h-20 w-20 rounded-2xl object-contain bg-background/50 p-2" />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gradient-neon flex items-center justify-center shadow-glow-blue">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={onLogoFile} />
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => fileRef.current?.click()}><Camera className="h-3.5 w-3.5 me-1.5" />{t("settings.uploadLogo")}</Button>
                    {s.logoUrl && (
                      <Button size="sm" variant="ghost" className="text-xs text-rose-300" onClick={() => s.setLogo("")}>
                        <Trash2 className="h-3 w-3 me-1" />{t("settings.removeLogo")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        {/* Pages */}
        {canPages && (
          <TabsContent value="pages">
            <div className="grid gap-4">
              {(["privacy", "contact", "support", "terms"] as const).map((slug) => (
                <PageEditor key={slug} slug={slug} />
              ))}
            </div>
          </TabsContent>
        )}

        {/* Taxonomy */}
        {canTax && (
          <TabsContent value="tax">
            <div className="grid gap-4 md:grid-cols-2">
              <TaxonomyCard
                title={t("settings.add.subject")} icon={BookOpen}
                items={[
                  ...SUBJECTS.map((x) => ({ id: x.key, label: t(`subject.${x.key}`), builtin: true })),
                  ...s.customSubjects.map((x) => ({ id: x.key, label: x.label.ar, builtin: false })),
                ]}
                onAdd={(k, ar, en, fr) => { if (!s.addSubject(k, ar, en, fr)) toast.error(t("settings.exists")); else toast.success("✓"); }}
                onRemove={(id) => s.removeSubject(id)}
                fields={["key"]}
              />
              <TaxonomyCard
                title={t("settings.add.country")} icon={Globe}
                items={[
                  ...COUNTRIES.map((c) => ({ id: c, label: t(`country.${c}`), builtin: true })),
                  ...s.customCountries.map((x) => ({ id: x.code, label: x.label.ar, builtin: false })),
                ]}
                onAdd={(k, ar, en, fr) => { if (!s.addCountry(k, ar, en, fr)) toast.error(t("settings.exists")); else toast.success("✓"); }}
                onRemove={(id) => s.removeCountry(id)}
                fields={["code"]}
              />
              <TaxonomyCard
                title={t("settings.add.stage")} icon={GraduationCap}
                items={[
                  ...STAGES.map((x) => ({ id: x, label: t(`stage.${x}`), builtin: true })),
                  ...s.customStages.map((x) => ({ id: x.key, label: x.label.ar, builtin: false })),
                ]}
                onAdd={(k, ar, en, fr) => { if (!s.addStage(k, ar, en, fr)) toast.error(t("settings.exists")); else toast.success("✓"); }}
                onRemove={(id) => s.removeStage(id)}
                fields={["key"]}
              />
              <TaxonomyCard
                title={t("settings.add.type")} icon={Tag}
                items={[
                  { id: "book", label: t("type.book"), builtin: true },
                  { id: "exam", label: t("type.exam"), builtin: true },
                  { id: "quiz", label: t("type.quiz"), builtin: true },
                  ...s.customTypes.map((x) => ({ id: x.key, label: x.label.ar, builtin: false })),
                ]}
                onAdd={(k, ar, en, fr) => { if (!s.addType(k, ar, en, fr)) toast.error(t("settings.exists")); else toast.success("✓"); }}
                onRemove={(id) => s.removeType(id)}
                fields={["key"]}
              />
            </div>
          </TabsContent>
        )}

        {/* Admins */}
        {canUsers && (
          <TabsContent value="admins">
            <AdminsManager />
          </TabsContent>
        )}

        {/* Users */}
        {canUsers && (
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function PageEditor({ slug }: { slug: "privacy" | "contact" | "support" | "terms" }) {
  const t = useT();
  const s = useSettings();
  const [body, setBody] = useState(s.pages[slug].body);

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />
        <h3 className="text-lg font-bold">{t(`settings.page.${slug}`)}</h3>
        <Link to={`/${slug}` as "/privacy"} className="text-xs text-muted-foreground hover:text-foreground ms-auto underline-offset-4 hover:underline">
          {t("section.viewAll")} →
        </Link>
      </div>
      <Textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm rounded-xl bg-background/50" />
      <Button onClick={() => { s.setPage(slug, body); toast.success(t("profile.saved")); }} className="mt-3 h-10 rounded-full bg-gradient-neon text-white font-bold">
        <Save className="h-4 w-4 me-2" />{t("common.save")}
      </Button>
    </div>
  );
}

function TaxonomyCard({
  title, icon: Icon, items, onAdd, onRemove, fields,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { id: string; label: string; builtin: boolean }[];
  onAdd: (k: string, ar: string, en: string, fr: string) => void;
  onRemove: (id: string) => void;
  fields: ("key" | "code")[];
}) {
  const t = useT();
  const [k, setK] = useState("");
  const [ar, setAr] = useState("");
  const [en, setEn] = useState("");
  const [fr, setFr] = useState("");

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input placeholder={t(fields[0] === "code" ? "settings.field.code" : "settings.field.key")} value={k} onChange={(e) => setK(e.target.value)} className="h-9 rounded-lg bg-background/50 col-span-2" />
        <Input placeholder={t("settings.field.ar")} value={ar} onChange={(e) => setAr(e.target.value)} className="h-9 rounded-lg bg-background/50 col-span-2" />
        <Input placeholder={t("settings.field.en")} value={en} onChange={(e) => setEn(e.target.value)} className="h-9 rounded-lg bg-background/50" />
        <Input placeholder={t("settings.field.fr")} value={fr} onChange={(e) => setFr(e.target.value)} className="h-9 rounded-lg bg-background/50" />
      </div>
      <Button size="sm" className="rounded-full bg-gradient-neon text-white font-bold w-full"
        onClick={() => { if (!k.trim() || !ar.trim()) return; onAdd(k, ar, en, fr); setK(""); setAr(""); setEn(""); setFr(""); }}>
        <Plus className="h-3.5 w-3.5 me-1" />{t("settings.add")}
      </Button>
      <div className="mt-4 flex flex-wrap gap-1.5 max-h-40 overflow-auto">
        {items.map((it) => (
          <span key={it.id} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border ${it.builtin ? "bg-white/5 border-white/10 text-muted-foreground" : "bg-[oklch(0.68_0.22_255)]/10 border-[oklch(0.68_0.22_255)]/30 text-foreground"}`}>
            {it.label}
            {!it.builtin && (
              <button onClick={() => onRemove(it.id)} className="hover:text-rose-400" aria-label="remove">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function AdminsManager() {
  const t = useT();
  const users = useUsers((s) => s.users);
  const createAdmin = useUsers((s) => s.createAdmin);
  const setPerms = useUsers((s) => s.setPermissions);
  const removeUser = useUsers((s) => s.removeUser);
  const admins = users.filter((u) => u.role === "admin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [perms, setLocalPerms] = useState<Permission[]>(["approve_content"]);

  const togglePerm = (p: Permission) =>
    setLocalPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = createAdmin({ name, email, password: pw, permissions: perms });
    if (r.error === "EMAIL_EXISTS") return toast.error(t("auth.error.exists"));
    if (r.error === "BAD_EMAIL") return toast.error(t("auth.error.badEmail"));
    if (r.error === "SHORT_PW") return toast.error(t("auth.error.shortPw"));
    if (r.error) return toast.error(r.error);
    toast.success(t("settings.adminCreated"));
    setName(""); setEmail(""); setPw("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />
          <h3 className="text-lg font-bold">{t("settings.addAdmin")}</h3>
        </div>
        <Input placeholder={t("auth.name")} value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-background/50" required />
        <Input type="email" placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background/50" required />
        <Input type="password" placeholder={t("auth.password")} value={pw} onChange={(e) => setPw(e.target.value)} className="h-11 rounded-xl bg-background/50" required />
        <div className="space-y-2 pt-2">
          {ALL_PERMISSIONS.map((p) => (
            <label key={p} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-smooth">
              <Checkbox checked={perms.includes(p)} onCheckedChange={() => togglePerm(p)} />
              <span className="text-sm">{t(`settings.perm.${p}`)}</span>
            </label>
          ))}
        </div>
        <Button type="submit" className="w-full h-11 rounded-full bg-gradient-neon text-white font-bold">
          <Plus className="h-4 w-4 me-2" />{t("settings.addAdmin")}
        </Button>
      </form>

      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />{t("settings.admins")}</h3>
        <div className="space-y-3 max-h-[600px] overflow-auto">
          {admins.map((a) => (
            <div key={a.id} className="rounded-2xl bg-background/40 border border-white/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {a.name}
                    {a.isOwner && <span className="text-[10px] uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-full px-2 py-0.5">{t("settings.user.owner")}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{a.email}</div>
                </div>
                {!a.isOwner && (
                  <Button size="icon" variant="ghost" className="text-rose-400 hover:bg-rose-500/10" onClick={() => { if (confirm(t("admin.confirm"))) removeUser(a.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PERMISSIONS.map((p) => {
                  const has = a.isOwner || a.permissions.includes(p);
                  return (
                    <button key={p} disabled={a.isOwner} onClick={() => {
                      const next = has ? a.permissions.filter((x) => x !== p) : [...a.permissions, p];
                      setPerms(a.id, next); toast.success(t("settings.permsUpdated"));
                    }} className={`text-[10px] px-2 py-1 rounded-full border transition-smooth ${has ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/30"} ${a.isOwner ? "cursor-not-allowed opacity-70" : ""}`}>
                      {t(`settings.perm.${p}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersManager() {
  const t = useT();
  const users = useUsers((s) => s.users);
  const setRole = useUsers((s) => s.setRole);
  const setDisabled = useUsers((s) => s.setDisabled);
  const removeUser = useUsers((s) => s.removeUser);

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserCog className="h-5 w-5 text-[oklch(0.66_0.24_295)]" />{t("settings.users")} ({users.length})</h3>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-background/40 border border-white/5">
            <div className="h-10 w-10 rounded-xl bg-gradient-neon flex items-center justify-center font-bold text-white">{u.name.charAt(0)}</div>
            <div className="flex-1 min-w-[180px]">
              <div className="font-bold text-sm">{u.name} {u.disabled && <span className="ms-2 text-[10px] text-rose-300 bg-rose-500/15 border border-rose-400/30 rounded-full px-2 py-0.5">{t("settings.user.disabled")}</span>}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            <select value={u.role} disabled={u.isOwner} onChange={(e) => setRole(u.id, e.target.value as "student" | "teacher" | "admin")} className="h-9 px-3 rounded-lg bg-background/50 text-sm border border-white/10">
              <option value="student">{t("settings.role.student")}</option>
              <option value="teacher">{t("settings.role.teacher")}</option>
              <option value="admin">{t("settings.role.admin")}</option>
            </select>
            <Button size="sm" variant="outline" disabled={u.isOwner} onClick={() => setDisabled(u.id, !u.disabled)} className="rounded-full">
              {u.disabled ? t("settings.user.enable") : t("settings.user.disable")}
            </Button>
            <Button size="icon" variant="ghost" disabled={u.isOwner} className="text-rose-400 hover:bg-rose-500/10" onClick={() => { if (confirm(t("admin.confirm"))) removeUser(u.id); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
