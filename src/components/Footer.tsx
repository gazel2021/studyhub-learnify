import { Link } from "@tanstack/react-router";
import { GraduationCap, Github, Twitter, Mail, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { logoUrl, appName } = useSettings();
  const t = useT();
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.66_0.24_295)] to-transparent opacity-60" />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-neon shadow-glow-blue overflow-hidden">
                {logoUrl ? <img src={logoUrl} alt="logo" className="h-full w-full object-contain" /> : <GraduationCap className="h-5 w-5 text-white" />}
              </div>
              <span className="text-xl font-bold font-display">{appName || "StudyHub"}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[oklch(0.78_0.20_150)]">
              <Sparkles className="h-3 w-3" /> Pi Network ready
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("footer.platform")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products" className="hover:text-gradient-neon transition-smooth">{t("nav.browse")}</Link></li>
              <li><Link to="/dashboard" className="hover:text-gradient-neon transition-smooth">{t("nav.dashboard")}</Link></li>
              <li><Link to="/upload" className="hover:text-gradient-neon transition-smooth">{t("nav.upload")}</Link></li>
              <li><Link to="/auth" className="hover:text-gradient-neon transition-smooth">{t("nav.signin")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="hover:text-foreground transition-smooth">{t("page.privacy.title")}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-smooth">{t("page.terms.title")}</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-smooth">{t("page.contact.title")}</Link></li>
              <li><Link to="/support" className="hover:text-foreground transition-smooth">{t("page.support.title")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t("footer.connect")}</h4>
            <div className="flex gap-2.5">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-gradient-neon hover:shadow-glow-blue hover:scale-110 transition-smooth"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {appName || "StudyHub"}.</span>
          <span className="font-mono text-[11px] uppercase tracking-wider">v1.0</span>
        </div>
      </div>
    </footer>
  );
}
