import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PageContent {
  /** Markdown / plain text content. */
  body: string;
  /** Last update timestamp. */
  updatedAt: number;
}

export interface AppSettings {
  /** Logo image as data URL or http URL. Empty = use default GraduationCap. */
  logoUrl: string;
  /** App display name (defaults to "StudyHub"). */
  appName: string;
  /** Editable site pages, keyed by slug. */
  pages: Record<"privacy" | "contact" | "support" | "terms", PageContent>;
  /** Custom taxonomy added by admins. */
  customSubjects: { key: string; label: { ar: string; en: string; fr: string } }[];
  customCountries: { code: string; label: { ar: string; en: string; fr: string } }[];
  customStages: { key: string; label: { ar: string; en: string; fr: string } }[];
  customTypes: { key: string; label: { ar: string; en: string; fr: string } }[];
}

interface SettingsState extends AppSettings {
  setLogo: (url: string) => void;
  setAppName: (n: string) => void;
  setPage: (slug: keyof AppSettings["pages"], body: string) => void;
  addSubject: (key: string, ar: string, en: string, fr: string) => boolean;
  addCountry: (code: string, ar: string, en: string, fr: string) => boolean;
  addStage: (key: string, ar: string, en: string, fr: string) => boolean;
  addType: (key: string, ar: string, en: string, fr: string) => boolean;
  removeSubject: (key: string) => void;
  removeCountry: (code: string) => void;
  removeStage: (key: string) => void;
  removeType: (key: string) => void;
  reset: () => void;
}

const DEFAULT_PAGES: AppSettings["pages"] = {
  privacy: {
    body: `# سياسة الخصوصية

نحن في StudyHub نأخذ خصوصيتك بجدية. نقوم بجمع البيانات الضرورية فقط لتقديم الخدمة.

## ما نجمعه
- الاسم والبريد الإلكتروني
- محتوى المشتريات
- إعدادات الحساب

## كيف نستخدم بياناتك
- تقديم الخدمة وتحسينها
- التواصل المتعلق بحسابك
- معالجة المدفوعات

يمكنك تعديل هذه السياسة من لوحة الإدارة.`,
    updatedAt: Date.now(),
  },
  contact: {
    body: `# اتصل بنا

نحن سعداء بسماع رأيك!

📧 **البريد الإلكتروني:** support@studyhub.app
📱 **الهاتف:** +000 000 0000
🌐 **الموقع:** studyhub.app

## ساعات العمل
الأحد إلى الخميس: 9:00 صباحًا — 6:00 مساءً (بتوقيت غرينتش)

عدّل هذه المعلومات من لوحة الإدارة.`,
    updatedAt: Date.now(),
  },
  support: {
    body: `# الدعم الفني

هل تواجه مشكلة؟ نحن هنا للمساعدة.

## الأسئلة الشائعة
- **كيف أشتري كتابًا؟** أضف الكتاب إلى السلة ثم اضغط "إتمام الشراء".
- **كيف أرفع محتوى؟** اذهب إلى صفحة "أضف محتوى" بعد تسجيل الدخول.
- **كيف أغير اللغة؟** من زر اللغة في أعلى الصفحة.

## تواصل مع الدعم
أرسل لنا بريدًا على support@studyhub.app وسنرد خلال 24 ساعة.`,
    updatedAt: Date.now(),
  },
  terms: {
    body: `# الشروط والأحكام

باستخدامك لمنصة StudyHub فإنك توافق على هذه الشروط.

## الاستخدام المقبول
- لا تنسخ أو توزّع المحتوى المدفوع بدون إذن.
- احترم حقوق الملكية الفكرية للمؤلفين.

## المحتوى المُقدَّم
كل محتوى يُرفع يخضع لمراجعة الإدارة قبل النشر.`,
    updatedAt: Date.now(),
  },
};

const defaults: AppSettings = {
  logoUrl: "",
  appName: "StudyHub",
  pages: DEFAULT_PAGES,
  customSubjects: [],
  customCountries: [],
  customStages: [],
  customTypes: [],
};

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaults,
      setLogo: (logoUrl) => set({ logoUrl }),
      setAppName: (appName) => set({ appName }),
      setPage: (slug, body) =>
        set({
          pages: {
            ...get().pages,
            [slug]: { body, updatedAt: Date.now() },
          },
        }),
      addSubject: (key, ar, en, fr) => {
        if (!key.trim()) return false;
        const k = key.trim().toLowerCase().replace(/\s+/g, "_");
        if (get().customSubjects.find((s) => s.key === k)) return false;
        set({
          customSubjects: [
            ...get().customSubjects,
            { key: k, label: { ar, en: en || ar, fr: fr || ar } },
          ],
        });
        return true;
      },
      addCountry: (code, ar, en, fr) => {
        if (!code.trim()) return false;
        const c = code.trim().toUpperCase();
        if (get().customCountries.find((x) => x.code === c)) return false;
        set({
          customCountries: [
            ...get().customCountries,
            { code: c, label: { ar, en: en || ar, fr: fr || ar } },
          ],
        });
        return true;
      },
      addStage: (key, ar, en, fr) => {
        if (!key.trim()) return false;
        const k = key.trim().toLowerCase().replace(/\s+/g, "_");
        if (get().customStages.find((x) => x.key === k)) return false;
        set({
          customStages: [
            ...get().customStages,
            { key: k, label: { ar, en: en || ar, fr: fr || ar } },
          ],
        });
        return true;
      },
      addType: (key, ar, en, fr) => {
        if (!key.trim()) return false;
        const k = key.trim().toLowerCase().replace(/\s+/g, "_");
        if (get().customTypes.find((x) => x.key === k)) return false;
        set({
          customTypes: [
            ...get().customTypes,
            { key: k, label: { ar, en: en || ar, fr: fr || ar } },
          ],
        });
        return true;
      },
      removeSubject: (key) =>
        set({ customSubjects: get().customSubjects.filter((s) => s.key !== key) }),
      removeCountry: (code) =>
        set({ customCountries: get().customCountries.filter((s) => s.code !== code) }),
      removeStage: (key) =>
        set({ customStages: get().customStages.filter((s) => s.key !== key) }),
      removeType: (key) =>
        set({ customTypes: get().customTypes.filter((s) => s.key !== key) }),
      reset: () => set(defaults),
    }),
    { name: "studyhub-settings-v1", version: 1 },
  ),
);

/** Resolve a label using built-in i18n key first, then custom dynamic taxonomy. */
export function resolveTaxonomyLabel(
  list: { key?: string; code?: string; label: { ar: string; en: string; fr: string } }[],
  keyOrCode: string,
  lang: "ar" | "en" | "fr",
): string | null {
  const found = list.find((x) => x.key === keyOrCode || x.code === keyOrCode);
  if (!found) return null;
  return found.label[lang] || found.label.en || keyOrCode;
}
