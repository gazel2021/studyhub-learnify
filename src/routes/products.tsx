import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SUBJECTS, COUNTRIES } from "@/lib/data";
import { useProducts } from "@/lib/products";
import { useT } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SearchT = { subject?: string; country?: string; q?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): SearchT => ({
    subject: typeof s.subject === "string" ? s.subject : undefined,
    country: typeof s.country === "string" ? s.country : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const t = useT();
  const PRODUCTS = useProducts((s) => s.items);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [subject, setSubject] = useState(search.subject ?? "all");
  const [country, setCountry] = useState(search.country ?? "all");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
    if (subject !== "all") list = list.filter((p) => p.subject === subject);
    if (country !== "all") list = list.filter((p) => p.country === country);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, subject, country, sort, PRODUCTS]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display">{t("products.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("products.subtitle", { count: PRODUCTS.length })}</p>
      </div>

      <div className="glass rounded-2xl p-4 mb-8 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("products.search")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              navigate({ search: { ...search, q: e.target.value || undefined } });
            }}
            className="ps-10 h-11 rounded-xl bg-background"
          />
        </div>
        <Select value={subject} onValueChange={(v) => { setSubject(v); navigate({ search: { ...search, subject: v === "all" ? undefined : v } }); }}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t("products.filter.subject")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allSubjects")}</SelectItem>
            {SUBJECTS.map((s) => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={(v) => { setCountry(v); navigate({ search: { ...search, country: v === "all" ? undefined : v } }); }}>
          <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={t("products.filter.country")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("products.filter.allCountries")}</SelectItem>
            {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-11 rounded-xl"><SlidersHorizontal className="h-4 w-4 me-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">{t("products.sort.popular")}</SelectItem>
            <SelectItem value="rating">{t("products.sort.rating")}</SelectItem>
            <SelectItem value="price-asc">{t("products.sort.priceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("products.sort.priceDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">{t("products.empty")}</p>
          <Button variant="outline" className="mt-4" onClick={() => { setQ(""); setSubject("all"); setCountry("all"); navigate({ search: {} }); }}>
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
