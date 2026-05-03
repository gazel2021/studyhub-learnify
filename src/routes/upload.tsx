import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload as UploadIcon, ShieldAlert, FileText, ScrollText, Brain, Tag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useProducts } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { SUBJECTS, COUNTRIES, STAGES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

function UploadPage() {
  const t = useT();
  const user = useAuth((s) => s.user);
  const submit = useProducts((s) => s.submit);
  const navigate = useNavigate();
  const settings = useSettings();

  // Merge built-in taxonomy with admin-added entries
  const subjectOptions = [
    ...SUBJECTS.map((x) => ({ value: x.key, label: t(`subject.${x.key}`) })),
    ...settings.customSubjects.map((x) => ({ value: x.key, label: x.label.ar })),
  ];
  const countryOptions = [
    ...COUNTRIES.map((c) => ({ value: c, label: t(`country.${c}`) })),
    ...settings.customCountries.map((x) => ({ value: x.code, label: x.label.ar })),
  ];
  const stageOptions = [
    ...STAGES.map((s) => ({ value: s, label: t(`stage.${s}`) })),
    ...settings.customStages.map((x) => ({ value: x.key, label: x.label.ar })),
  ];
  const typeOptions = [
    { value: "book", label: t("admin.type.book"), icon: FileText },
    { value: "exam", label: t("admin.type.exam"), icon: ScrollText },
    { value: "quiz", label: t("admin.type.quiz"), icon: Brain },
    ...settings.customTypes.map((x) => ({ value: x.key, label: x.label.ar, icon: Tag })),
  ];

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "book" as "book" | "exam" | "quiz",
    subject: SUBJECTS[0].key,
    country: "GLOBAL",
    stage: STAGES[0],
    price: "0",
    author: user?.name ?? "",
    image: "",
    pages: "",
    content: "",
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-[oklch(0.66_0.24_295)]" />
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <p className="text-muted-foreground mt-2">{t("common.signinDesc")}</p>
        <Link to="/auth">
          <Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-neon text-white shadow-glow-blue">
            {t("common.goSignin")}
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.author) {
      toast.error(t("common.required"));
      return;
    }
    const product = submit({
      title: form.title,
      description: form.description,
      type: form.type,
      subject: form.subject,
      country: form.country,
      stage: form.stage,
      price: parseFloat(form.price) || 0,
      author: form.author,
      image: form.image || undefined,
      pages: form.pages ? parseInt(form.pages, 10) : undefined,
      content: form.content || undefined,
      ownerId: user.id,
      ownerRole: user.role,
    });
    toast.success(user.role === "admin" ? t("admin.success") : t("admin.success.pending"));
    navigate({ to: user.role === "admin" ? "/products/$id" : "/dashboard", params: { id: product.id } });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
          <UploadIcon className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
          <span>{t("nav.upload")}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
          {t("upload.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("upload.subtitle")}</p>

        {user.role !== "admin" && (
          <div className="mt-5 rounded-2xl glass p-4 text-sm flex gap-3 items-start border border-amber-400/20">
            <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-foreground/90">{t("upload.guideline")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-strong border-gradient rounded-3xl p-6 md:p-8 mt-8 grid gap-5 md:grid-cols-2">
          <Field label={t("admin.form.titleField")} className="md:col-span-2">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-11 rounded-xl bg-background/50" required />
          </Field>

          <Field label={t("admin.form.description")} className="md:col-span-2">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="rounded-xl bg-background/50" required />
          </Field>

          <Field label={t("admin.form.type")}>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as typeof form.type })}>
              <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {typeOptions.map((o) => {
                  const Icon = o.icon;
                  return (
                    <SelectItem key={o.value} value={o.value}>
                      <Icon className="h-3.5 w-3.5 inline me-2" />{o.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("admin.form.subject")}>
            <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
              <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {subjectOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("admin.form.country")}>
            <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
              <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {countryOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("admin.form.stage")}>
            <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
              <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stageOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label={t("admin.form.price")}>
            <Input type="number" step="0.01" min="0" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="h-11 rounded-xl bg-background/50" />
          </Field>

          <Field label={t("admin.form.pages")}>
            <Input type="number" min="0" value={form.pages}
              onChange={(e) => setForm({ ...form, pages: e.target.value })}
              className="h-11 rounded-xl bg-background/50" />
          </Field>

          <Field label={t("admin.form.author")}>
            <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="h-11 rounded-xl bg-background/50" required />
          </Field>

          <Field label={t("admin.form.image")} className="md:col-span-2">
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..." className="h-11 rounded-xl bg-background/50" />
          </Field>

          <Field label={t("admin.form.content")} className="md:col-span-2">
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6} className="rounded-xl bg-background/50 font-mono text-sm" />
          </Field>

          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <Button type="submit" className="h-12 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth">
              <Plus className="h-4 w-4 me-2" />
              {t("admin.form.submit")}
            </Button>
            <Link to="/products">
              <Button type="button" variant="outline" className="h-12 rounded-full">
                {t("common.cancel")}
              </Button>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
