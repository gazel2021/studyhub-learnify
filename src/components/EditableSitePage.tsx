import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store";
import { hasPermission, useUsers } from "@/lib/users";
import { useSettings, type AppSettings } from "@/lib/settings";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type EditablePageSlug = keyof AppSettings["pages"];

export function EditableSitePage({ slug }: { slug: EditablePageSlug }) {
  const t = useT();
  const sessionUser = useAuth((s) => s.user);
  const account = useUsers((s) => (sessionUser ? s.users.find((u) => u.id === sessionUser.id) : undefined));
  const body = useSettings((s) => s.pages[slug].body);
  const setPage = useSettings((s) => s.setPage);
  const canEdit = hasPermission(account, "edit_pages");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);

  useEffect(() => {
    if (!editing) setDraft(body);
  }, [body, editing]);

  const save = () => {
    setPage(slug, draft);
    setEditing(false);
    toast.success(t("profile.saved"));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">{t(`page.${slug}.title`)}</h1>
          {canEdit && !editing && (
            <Button onClick={() => setEditing(true)} className="h-11 rounded-full bg-primary text-primary-foreground font-bold">
              <Edit3 className="h-4 w-4 me-2" />{t("common.edit")}
            </Button>
          )}
        </div>

        <div className="glass-strong border-gradient rounded-3xl p-6 md:p-10">
          {editing ? (
            <div className="space-y-4">
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={16} className="rounded-xl bg-background/50 font-sans text-base leading-relaxed" />
              <div className="flex flex-wrap gap-2">
                <Button onClick={save} className="h-11 rounded-full bg-primary text-primary-foreground font-bold">
                  <Save className="h-4 w-4 me-2" />{t("common.save")}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setDraft(body); setEditing(false); }} className="h-11 rounded-full">
                  <X className="h-4 w-4 me-2" />{t("common.cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-base leading-relaxed font-sans">{body}</pre>
          )}
        </div>
      </motion.div>
    </div>
  );
}