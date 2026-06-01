import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun, GraduationCap, ShoppingCart, User as UserIcon, Menu, Sparkles, Languages, Shield, Settings as SettingsIcon, Code2, Upload as UploadIcon, Share2 } from "lucide-react";
import { useTheme, useAuth, useCart } from "@/lib/store";
import { useUsers, hasPermission } from "@/lib/users";
import { useSettings } from "@/lib/settings";
import { useI18n, useT, LANGUAGES, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { theme, toggle, init } = useTheme();
  const { user, logout } = useAuth();
  const account = useUsers((s) => (user ? s.users.find((u) => u.id === user.id) : undefined));
  const { logoUrl, appName } = useSettings();
  const items = useCart((s) => s.items);
  const { lang, setLang } = useI18n();
  const t = useT();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    init();
  }, [init]);

  const canViewCode = hasPermission(account, "view_code");

  const NAV = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.browse") },
    { to: "/dashboard", label: t("nav.dashboard") },
    ...(user ? [{ to: "/upload", label: t("nav.upload") }] : []),
    ...(user ? [{ to: "/affiliate", label: t("nav.affiliate") }] : []),
    ...(user?.role === "admin" ? [{ to: "/admin", label: t("nav.admin") }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-neon blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-neon shadow-glow-blue overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="h-full w-full object-contain" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              {appName || "StudyHub"}
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 glass rounded-full px-1.5 py-1.5">
            {NAV.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-smooth ${
                    active
                      ? "bg-gradient-neon text-white shadow-glow-blue"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t("nav.language")} className="rounded-full hover:bg-white/5 relative">
                  <Languages className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-gradient-neon text-white rounded-md px-1 leading-tight">
                    {lang.toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 glass-strong border-white/10">
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("nav.language")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code as Lang)}
                    className={`rounded-lg cursor-pointer flex items-center gap-2 ${lang === l.code ? "bg-white/5 text-foreground" : ""}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="font-medium">{l.label}</span>
                    {lang === l.code && <Sparkles className="h-3 w-3 ms-auto text-[oklch(0.66_0.24_295)]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("nav.theme")} className="rounded-full hover:bg-white/5">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label={t("nav.cart")} className="rounded-full hover:bg-white/5">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_65)] to-[oklch(0.65_0.25_25)] text-[10px] font-bold text-white shadow-lg">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                    <div className="h-8 w-8 rounded-full bg-gradient-neon flex items-center justify-center text-xs font-bold text-white shadow-glow-blue">
                      {user.name.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 glass-strong border-white/10">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mt-0.5">
                      <Sparkles className="h-3 w-3 text-[oklch(0.66_0.24_295)]" />
                      {user.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/dashboard">{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/profile">
                      <UserIcon className="h-3.5 w-3.5 me-2" />
                      {t("profile.title")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/upload">
                      <UploadIcon className="h-3.5 w-3.5 me-2" />
                      {t("nav.upload")}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link to="/admin">
                          <Shield className="h-3.5 w-3.5 me-2" />
                          {t("nav.admin")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link to="/settings">
                          <SettingsIcon className="h-3.5 w-3.5 me-2" />
                          {t("nav.settings")}
                        </Link>
                      </DropdownMenuItem>
                      {canViewCode && (
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                          <Link to="/code">
                            <Code2 className="h-3.5 w-3.5 me-2" />
                            {t("nav.code")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer">{t("nav.signout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button className="relative bg-gradient-neon text-white shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth font-semibold rounded-full px-5">
                  <UserIcon className="h-4 w-4 me-1.5" />
                  {t("nav.signin")}
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-white/5">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-strong border-white/10">
                <div className="flex flex-col gap-2 mt-8">
                  {NAV.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="px-4 py-3 rounded-xl hover:bg-white/5 text-base font-medium transition-smooth"
                    >
                      {n.label}
                    </Link>
                  ))}
                  {!user && (
                    <Link to="/auth" className="mt-4">
                      <Button className="w-full bg-gradient-neon text-white shadow-glow-blue rounded-full font-semibold">{t("nav.signin")}</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
