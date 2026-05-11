import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Copy, Search, Shield, FileCode2, Folder } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { useUsers, hasPermission } from "@/lib/users";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Eagerly load all src/ files as raw strings (admin-only viewer).
// Vite resolves this at build time — no network requests at runtime.
const RAW_FILES_ALL = import.meta.glob(
  "/src/**/*.{ts,tsx,css,json,js,md}",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
const RAW_FILES: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_FILES_ALL).filter(
    ([p]) =>
      !p.endsWith("/routeTree.gen.ts") &&
      !p.endsWith("/integrations/supabase/types.ts") &&
      !/\.server\.[^/]+$/.test(p),
  ),
);

export const Route = createFileRoute("/code")({
  component: CodeViewerPage,
});

function CodeViewerPage() {
  const t = useT();
  const sessionUser = useAuth((s) => s.user);
  const account = useUsers((s) =>
    sessionUser ? s.users.find((u) => u.id === sessionUser.id) : undefined,
  );
  // Admins always have access; sub-admins still need the explicit permission.
  const canView =
    sessionUser?.role === "admin" &&
    (!account || account.isOwner || hasPermission(account, "view_code") || account.email?.toLowerCase() === "owner@studyhub.app");

  const files = useMemo(
    () =>
      Object.keys(RAW_FILES)
        .map((p) => p.replace(/^\/src\//, "src/"))
        .sort(),
    [],
  );

  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(files[0] ?? "");

  if (!sessionUser || !account || account.role !== "admin" || !canView) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-rose-400" />
        <h1 className="text-2xl font-bold">{t("admin.denied")}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {t("nav.permissionDenied")}
        </p>
        <Link to="/">
          <Button className="mt-6 h-12 px-6 rounded-xl bg-gradient-neon text-white">
            {t("common.backHome")}
          </Button>
        </Link>
      </div>
    );
  }

  const filtered = files.filter((f) =>
    f.toLowerCase().includes(query.toLowerCase()),
  );

  const activeContent = active
    ? RAW_FILES["/" + active] ?? ""
    : "";

  const copy = async () => {
    await navigator.clipboard.writeText(activeContent);
    toast.success(t("code.copied"));
  };

  const downloadAll = () => {
    // Naive bundle: concatenate all files into one big text file.
    const blob = new Blob(
      [
        files
          .map(
            (f) =>
              `// ============================================================\n// FILE: ${f}\n// ============================================================\n${RAW_FILES["/" + f]}\n\n`,
          )
          .join(""),
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studyhub-source.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider mb-3">
          <Code2 className="h-3.5 w-3.5 text-[oklch(0.66_0.24_295)]" />
          <span>{t("nav.code")}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              {t("code.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("code.subtitle")}</p>
          </div>
          <Button
            onClick={downloadAll}
            variant="outline"
            className="rounded-full"
          >
            {t("code.download")}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        {/* File tree */}
        <div className="glass rounded-3xl p-3 md:p-4 h-[70vh] flex flex-col">
          <div className="relative mb-3">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("code.search")}
              className="ps-10 h-10 rounded-xl bg-background/50"
            />
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
            <Folder className="h-3 w-3" />
            {t("code.files", { n: String(filtered.length) })}
          </div>
          <div className="overflow-auto flex-1 -mx-1 pe-1">
            {filtered.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`w-full text-start px-2 py-1.5 rounded-lg text-xs font-mono truncate transition-smooth flex items-center gap-1.5 ${
                  active === f
                    ? "bg-gradient-neon text-white shadow-glow-blue"
                    : "hover:bg-white/5 text-muted-foreground"
                }`}
                title={f}
              >
                <FileCode2 className="h-3 w-3 shrink-0" />
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass-strong border-gradient rounded-3xl overflow-hidden h-[70vh] flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-background/30">
            <div className="font-mono text-xs truncate">{active || t("code.empty")}</div>
            <Button
              size="sm"
              onClick={copy}
              disabled={!active}
              className="rounded-full h-8 bg-gradient-neon text-white font-bold"
            >
              <Copy className="h-3.5 w-3.5 me-1.5" />
              {t("code.copy")}
            </Button>
          </div>
          <pre className="flex-1 overflow-auto p-4 text-[12px] leading-relaxed font-mono whitespace-pre">
            {activeContent || t("code.empty")}
          </pre>
        </div>
      </div>
    </div>
  );
}
