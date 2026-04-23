import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun, GraduationCap, ShoppingCart, User as UserIcon, Menu } from "lucide-react";
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
      <div className="glass border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-elegant transition-smooth group-hover:scale-110">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Study<span className="text-gradient-brand">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-smooth hover:text-primary ${
                  path === n.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {n.label}
                {path === n.to && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-brand rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <div className="h-7 w-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <Button className="bg-gradient-brand text-white shadow-elegant hover:opacity-90 transition-smooth">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-2 mt-8">
                  {NAV.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="px-4 py-3 rounded-lg hover:bg-muted text-base font-medium"
                    >
                      {n.label}
                    </Link>
                  ))}
                  {!user && (
                    <Link to="/auth" className="mt-4">
                      <Button className="w-full bg-gradient-brand text-white">Sign In</Button>
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
