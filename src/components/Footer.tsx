import { Link } from "@tanstack/react-router";
import { GraduationCap, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Study<span className="text-gradient-brand">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The modern platform for learners and educators across the globe.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-primary transition-smooth">Browse</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-smooth">Dashboard</Link></li>
              <li><Link to="/auth" className="hover:text-primary transition-smooth">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-smooth"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-smooth"><Github className="h-4 w-4" /></a>
              <a href="#" className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-smooth"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} StudyHub. Crafted for learners.
        </div>
      </div>
    </footer>
  );
}
