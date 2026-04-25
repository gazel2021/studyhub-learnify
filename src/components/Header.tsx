import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun, GraduationCap, ShoppingCart, User as UserIcon, Menu, Sparkles } from "lucide-react";
import { useTheme, useAuth, useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Browse" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Header() {
  const { theme, toggle, init } = useTheme();
  const { user, logout } = useAuth();
  const items = useCart((s) => s.items);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    init();
  }, [init]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-neon blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-neon shadow-glow-blue">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight font-display">
              Study<span className="text-gradient-neon">Hub</span>
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full hover:bg-white/5">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart" className="rounded-full hover:bg-white/5">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_65)] to-[oklch(0.65_0.25_25)] text-[10px] font-bold text-white shadow-lg">
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
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="rounded-lg cursor-pointer">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button className="relative bg-gradient-neon text-white shadow-glow-blue hover:shadow-glow-purple hover:scale-105 transition-smooth font-semibold rounded-full px-5">
                  <UserIcon className="h-4 w-4 mr-1.5" />
                  Sign In
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
                      <Button className="w-full bg-gradient-neon text-white shadow-glow-blue rounded-full font-semibold">Sign In</Button>
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
