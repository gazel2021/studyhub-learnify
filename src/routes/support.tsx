import { createFileRoute } from "@tanstack/react-router";
import { useSettings } from "@/lib/settings";
import { useT } from "@/lib/i18n";
import { motion } from "framer-motion";

export const Route = createFileRoute("/support")({
  component: () => {
    const t = useT();
    const body = useSettings((s) => s.pages.support.body);
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-6">{t("page.support.title")}</h1>
          <div className="glass-strong border-gradient rounded-3xl p-6 md:p-10">
            <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans">{body}</pre>
          </div>
        </motion.div>
      </div>
    );
  },
});
