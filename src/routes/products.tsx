import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Plus, Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SUBJECTS, COUNTRIES, STAGES } from "@/lib/data";
import { useProducts, selectApproved } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SearchT = { subject?: string; country?: string; stage?: string; type?: string; q?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): SearchT => ({
    subject: typeof s.subject === "string" ? s.subject : undefined,
    country: typeof s.country === "string" ? s.country : undefined,
    stage: typeof s.stage === "string" ? s.stage : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ProductsPage,
});

const TYPES = ["book", "exam", "quiz"] as const;

function ProductsPage() {
  const t = useT();
  const pathname = useLocation({ select: (location) => location.pathname });
  const user = useAuth((s) => s.user);
  const all = useProducts((s) => s.items);
  const PRODUCTS = selectApproved(all);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [subject, setSubject] = useState(search.subject ?? "all");
  const [country, setCountry] = useState(search.country ?? "all");
  const [stage, setStage] = useState(search.stage ?? "all");
  const [type, setType] = useState(search.type ?? "all");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(ql) ||
          p.description.toLowerCase().includes(ql) ||
          p.author.toLowerCase().includes(ql),
      );
    }
    if (subject !== "all") list = list.filter((p) => p.subject === subject);
    if (country !== "all") list = list.filter((p) => p.country === country);
    if (stage !== "all") list = list.filter((p) => p.stage === stage);
    if (type !== "all") list = list.filter((p) => p.type === type);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [q, subject, country, stage, type, sort, PRODUCTS]);

  const updateSearch = (patch: Partial<SearchT>) => navigate({ search: { ...search, ...patch } });

  if (pathname !== "/products") return <Outlet />;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display">{t("products.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("products.subtitle", { count: PRODUCTS.length })}</p>
        </div>
        {user && (
          <Link to="/upload">
            <Button className="h-11 rounded-full bg-gradient-neon text-white font-bold shadow-glow-blue hover:scale-105 transition-smooth">
              <Plus className="h-4 w-4 me-1.5" /> {t("nav.upload")}
            </Button>
          </Link>
        )}
      </div>

      <div className="glass rounded-2xl p-4 mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("products.search")}
            value={q}
            onChange={(e) => { setQ(e.target.value); updateSearch({ q: e.target.value || undefined }); }}
            className="ps-10 h-11 rounded-xl bg-background"
          />
        </div>
        <Select value={subject} onValueChange={(v) => { setSubject(v); updateSearch({ subject: v === "all" ? undefined : v }); }}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t("products.filter.subject")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allSubjects")}</SelectItem>
            {SUBJECTS.map((s) => <SelectItem key={s.key} value={s.key}>{t(`subject.${s.key}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={(v) => { setCountry(v); updateSearch({ country: v === "all" ? undefined : v }); }}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t("products.filter.country")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allCountries")}</SelectItem>
            {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{t(`country.${c}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stage} onValueChange={(v) => { setStage(v); updateSearch({ stage: v === "all" ? undefined : v }); }}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t("products.filter.stage")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allStages")}</SelectItem>
            {STAGES.map((s) => <SelectItem key={s} value={s}>{t(`stage.${s}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => { setType(v); updateSearch({ type: v === "all" ? undefined : v }); }}>
          <SelectTrigger className="h-11 rounded-xl">
            <Filter className="h-3.5 w-3.5 me-1" /><SelectValue placeholder={t("products.filter.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allTypes")}</SelectItem>
            {TYPES.map((tp) => <SelectItem key={tp} value={tp}>{t(`type.${tp}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-muted-foreground">{t("products.results", { count: filtered.length })}</div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-10 rounded-xl w-auto min-w-[180px]">
            <SlidersHorizontal className="h-3.5 w-3.5 me-1" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">{t("products.sort.popular")}</SelectItem>
            <SelectItem value="newest">{t("products.sort.newest")}</SelectItem>
            <SelectItem value="rating">{t("products.sort.rating")}</SelectItem>
            <SelectItem value="price-asc">{t("products.sort.priceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("products.sort.priceDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl">
          <p className="text-muted-foreground text-lg">{t("products.empty")}</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => { setQ(""); setSubject("all"); setCountry("all"); setStage("all"); setType("all"); navigate({ search: {} }); }}>
            {t("products.reset")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
