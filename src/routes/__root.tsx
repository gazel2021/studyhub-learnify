import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { useI18nInit, useT } from "@/lib/i18n";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-black text-gradient-neon">404</h1>
        <h2 className="mt-4 text-2xl font-bold font-display">{t("common.notfound.t")}</h2>
        <p className="mt-2 text-muted-foreground">{t("common.notfound.d")}</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-neon text-white px-6 py-3 font-bold shadow-glow-blue hover:scale-105 transition-smooth"
        >
          {t("common.backHome")}
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StudyHub — Modern Learning Marketplace" },
      { name: "description", content: "Buy, sell, and master learning materials. PDF books, exams and interactive quizzes for every subject and stage." },
      { name: "author", content: "StudyHub" },
      { property: "og:title", content: "StudyHub — Modern Learning Marketplace" },
      { property: "og:description", content: "Buy, sell, and master learning materials. PDF books, exams and interactive quizzes for every subject and stage." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#5b3df5" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "StudyHub" },
      { name: "twitter:title", content: "StudyHub — Modern Learning Marketplace" },
      { name: "twitter:description", content: "Buy, sell, and master learning materials. PDF books, exams and interactive quizzes for every subject and stage." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4062b55d-209a-40ea-b599-8c2efb725efb/id-preview-336a82cd--ed276f04-7cf4-4e90-a316-c5f1536cb734.lovable.app-1778486879886.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4062b55d-209a-40ea-b599-8c2efb725efb/id-preview-336a82cd--ed276f04-7cf4-4e90-a316-c5f1536cb734.lovable.app-1778486879886.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" },
    ],
    scripts: [
      { src: "https://sdk.minepi.com/pi-sdk.js", async: true },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useI18nInit();
  useRefCapture();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

function useRefCapture() {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffectOnce(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        // dynamic import to avoid SSR pull
        import("@/lib/affiliate").then((m) => m.captureRef(ref));
      }
    } catch {
      /* ignore */
    }
  });
}

function useEffectOnce(fn: () => void) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
