import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Shield, FileText, ScrollText, Brain, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useProducts } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { SUBJECTS, COUNTRIES, STAGES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const TYPE_ICONS = { book: FileText, exam: ScrollText, quiz: Brain };

function AdminPage() {
  const t = useT();
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const products = useProducts((s) => s.items);
  const addProduct = useProducts((s) => s.add);
  const removeProduct = useProducts((s) => s.remove);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "book" as "book" | "exam" | "quiz",
    subject: SUBJECTS[0].name,
    country: COUNTRIES[0],
    stage: STAGES[0],
    price: "0",
    author: "",
    image: "",
  });

  // Quick admin login fallback
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-[oklch(0.66_0.24_295)]" />
        <h1 className="text-2xl font-bold">{t("common.signinRequired")}</h1>
        <p className="text-muted-foreground mt-2">{t("admin.denied")}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={() => {
              login({ id: "admin-1", name: "Admin", email: "admin@studyhub.app", role: "admin" });
              toast.success("Logged in as admin");
            }}
            className="h-12 rounded-xl bg-gradient-neon text-white shadow-glow-blue"
          >
            <Shield className="h-4 w-4 me-2" />
            {t("admin.signinAsAdmin")}
          </Button>
          <Link to="/auth">
            <Button variant="outline" className="w-full h-12 rounded-xl">
              {t("common.goSignin")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-rose-400" />
        <h1 className="text-2xl font-bold">{t("admin.denied")}</h1>
        <Link to="/">
          <Button className="mt-6 rounded-xl bg-gradient-neon text-white">{t("nav.home")}</Button>
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
    addProduct({
      title: form.title,
      description: form.description,
      type: form.type,
      subject: form.subject,
      country: form.country,
      stage: form.stage,
      price: parseFloat(form.price) || 0,
      author: form.author,
      image: form.image || SUBJECTS.find((s) => s.name === form.subject)?.image || SUBJECTS[0].image,
    });
    toast.success(t("admin.success"));
    setForm({ ...form, title: "", description: "", price: "0", author: "", image: "" });
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
            <span>{t("nav.admin")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
            {t("admin.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("admin.subtitle")}</p>
        </div>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="h-12 px-6 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth"
        >
          <Plus className="h-5 w-5 me-2" />
          {t("admin.add")}
        </Button>
      </div>

      {/* FORM */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-strong border-gradient rounded-3xl p-6 md:p-8 mb-10"
        >
          <h2 className="text-xl font-bold font-display mb-6">{t("admin.add")}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.titleField")}
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 rounded-xl bg-background/50"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.description")}
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="rounded-xl bg-background/50"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.type")}
              </Label>
              <Select value={form.type} onValueChange={(v: "book" | "exam" | "quiz") => setForm({ ...form, type: v })}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">{t("admin.type.book")}</SelectItem>
                  <SelectItem value="exam">{t("admin.type.exam")}</SelectItem>
                  <SelectItem value="quiz">{t("admin.type.quiz")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.subject")}
              </Label>
              <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.country")}
              </Label>
              <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.stage")}
              </Label>
              <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.price")}
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="h-11 rounded-xl bg-background/50"
              />
            </div>

            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.author")}
              </Label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="h-11 rounded-xl bg-background/50"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                {t("admin.form.image")}
              </Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="h-11 rounded-xl bg-background/50"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="submit" className="h-12 px-8 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue">
              <Plus className="h-4 w-4 me-2" />
              {t("admin.form.submit")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="h-12 rounded-full">
              {t("admin.form.cancel")}
            </Button>
          </div>
        </motion.form>
      )}

      {/* LIST */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-5 w-5 text-[oklch(0.68_0.22_255)]" />
          <h2 className="text-xl font-bold font-display">
            {t("admin.list")} <span className="text-muted-foreground font-normal">({products.length})</span>
          </h2>
        </div>
        <div className="grid gap-3">
          {products.map((p) => {
            const Icon = TYPE_ICONS[p.type] ?? FileText;
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-background/40 border border-white/5 hover:border-white/15 transition-smooth"
              >
                <img src={p.image} alt={p.title} className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Icon className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {p.type} · {p.subject}
                    </span>
                  </div>
                  <div className="font-bold text-sm line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{p.author} · {p.country}</div>
                </div>
                <div className="text-end">
                  <div className="font-extrabold text-gradient-neon">
                    {p.price === 0 ? t("card.free") : `$${p.price}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm(t("admin.confirm"))) removeProduct(p.id);
                  }}
                  className="rounded-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
