import { create } from "zustand";
import { useEffect } from "react";

export type Lang = "ar" | "en" | "fr";

type Dict = Record<string, string>;

const TRANSLATIONS: Record<Lang, Dict> = {
  ar: {
    // Header / Nav
    "nav.home": "الرئيسية",
    "nav.browse": "تصفح",
    "nav.dashboard": "لوحة التحكم",
    "nav.admin": "الإدارة",
    "nav.signin": "تسجيل الدخول",
    "nav.signout": "تسجيل الخروج",
    "nav.cart": "السلة",
    "nav.language": "اللغة",
    "nav.theme": "الوضع",

    // Hero
    "hero.badge": "مدعوم بالذكاء الاصطناعي · جاهز لشبكة Pi",
    "hero.title.1": "تعلّم بذكاء",
    "hero.title.2": "مع",
    "hero.title.3": "محتوى نيوني",
    "hero.title.4": "بقوة AI.",
    "hero.subtitle":
      "اكتشف آلاف الكتب الرقمية والامتحانات والاختبارات التفاعلية من نخبة المعلمين — كل ذلك في منصة سينمائية واحدة.",
    "hero.cta.start": "ابدأ الاستكشاف",
    "hero.cta.teacher": "كن معلمًا",
    "hero.stat.resources": "مورد",
    "hero.stat.educators": "معلم",
    "hero.stat.loved": "إعجاب",
    "hero.trusted": "موثوق به في أكثر من 60 دولة",

    // Sections
    "section.trending.kicker": "الأكثر رواجًا",
    "section.trending.title": "الأكثر شعبية",
    "section.trending.title.accent": "هذا الأسبوع",
    "section.viewAll": "عرض الكل",
    "section.categories.kicker": "الفئات",
    "section.categories.title": "تصفّح حسب",
    "section.categories.title.accent": "المادة",
    "section.categories.subtitle": "اعثر على المحتوى المناسب لمجال دراستك.",
    "section.latest.kicker": "أحدث الإصدارات",
    "section.latest.title": "أحدث",
    "section.latest.title.accent": "الإضافات",
    "section.types.title": "ثلاث طرق",
    "section.types.title.accent": "للتفوق",
    "type.book.t": "كتب PDF",
    "type.book.d": "مواد دراسية مختارة من نخبة الناشرين والمعلمين.",
    "type.exam.t": "امتحانات تجريبية",
    "type.exam.d": "أوراق امتحانات حقيقية مع نماذج إجابات مفصّلة.",
    "type.quiz.t": "اختبارات AI",
    "type.quiz.d": "اختبارات تفاعلية تتكيف مع مستوى تعلمك.",
    "feat.quality.t": "جودة موثقة",
    "feat.quality.d": "كل مورد يخضع لمراجعة فريق الخبراء لدينا.",
    "feat.educators.t": "أفضل المعلمين",
    "feat.educators.d": "تعلّم من أفضل المعلمين حول العالم.",
    "feat.pi.t": "جاهز لشبكة Pi",
    "feat.pi.d": "ادفع بالدولار، أو العملة المحلية، أو عملة Pi.",
    "cta.kicker": "لوقت محدود",
    "cta.title": "هل أنت مستعد",
    "cta.title.accent": "للتفوق؟",
    "cta.subtitle": "انضم إلى آلاف المتعلمين والمعلمين في بناء مستقبل التعليم.",
    "cta.start": "ابدأ مجانًا",
    "cta.browse": "تصفّح المحتوى",

    // Products page
    "products.title": "تصفح الموارد",
    "products.subtitle": "اكتشف أكثر من {count} كتاب وامتحان واختبار.",
    "products.search": "ابحث عن مورد...",
    "products.filter.subject": "المادة",
    "products.filter.country": "الدولة",
    "products.filter.allSubjects": "كل المواد",
    "products.filter.allCountries": "كل الدول",
    "products.sort.popular": "الأكثر شعبية",
    "products.sort.rating": "الأعلى تقييمًا",
    "products.sort.priceAsc": "السعر: من الأقل للأعلى",
    "products.sort.priceDesc": "السعر: من الأعلى للأقل",
    "products.empty": "لا توجد موارد.",
    "products.reset": "إعادة تعيين المرشحات",

    // Card
    "card.free": "مجاني",
    "card.by": "بقلم",

    // Admin
    "admin.title": "لوحة الإدارة",
    "admin.subtitle": "إضافة كتب ودروس وامتحانات جديدة إلى المنصة.",
    "admin.add": "إضافة منتج جديد",
    "admin.list": "المنتجات الحالية",
    "admin.form.titleField": "العنوان",
    "admin.form.description": "الوصف",
    "admin.form.type": "النوع",
    "admin.form.subject": "المادة",
    "admin.form.country": "الدولة",
    "admin.form.stage": "المرحلة",
    "admin.form.price": "السعر (USD)",
    "admin.form.author": "المؤلف",
    "admin.form.image": "رابط الصورة (اختياري)",
    "admin.form.submit": "إضافة المنتج",
    "admin.form.cancel": "إلغاء",
    "admin.success": "تمت إضافة المنتج بنجاح",
    "admin.delete": "حذف",
    "admin.confirm": "هل أنت متأكد؟",
    "admin.denied": "غير مسموح. الإدارة فقط.",
    "admin.signinAsAdmin": "سجّل دخول كمدير",
    "admin.type.book": "كتاب PDF",
    "admin.type.exam": "امتحان",
    "admin.type.quiz": "اختبار",

    // Common
    "common.loading": "جارٍ التحميل...",
    "common.required": "مطلوب",
    "common.signinRequired": "يجب تسجيل الدخول",
    "common.goSignin": "اذهب لتسجيل الدخول",
  },

  en: {
    "nav.home": "Home",
    "nav.browse": "Browse",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",
    "nav.signin": "Sign In",
    "nav.signout": "Sign Out",
    "nav.cart": "Cart",
    "nav.language": "Language",
    "nav.theme": "Theme",

    "hero.badge": "Powered by AI · Pi Network ready",
    "hero.title.1": "Learn smarter",
    "hero.title.2": "with",
    "hero.title.3": "neon-fast",
    "hero.title.4": "AI content.",
    "hero.subtitle":
      "Discover thousands of curated PDFs, mock exams and interactive quizzes from top educators — all in one cinematic, AI-native marketplace.",
    "hero.cta.start": "Start exploring",
    "hero.cta.teacher": "Become a teacher",
    "hero.stat.resources": "Resources",
    "hero.stat.educators": "Educators",
    "hero.stat.loved": "Loved it",
    "hero.trusted": "Trusted by learners in 60+ countries",

    "section.trending.kicker": "Trending Now",
    "section.trending.title": "Most popular",
    "section.trending.title.accent": "this week",
    "section.viewAll": "View all",
    "section.categories.kicker": "Categories",
    "section.categories.title": "Browse by",
    "section.categories.title.accent": "subject",
    "section.categories.subtitle": "Find content tailored to your area of study.",
    "section.latest.kicker": "Fresh drops",
    "section.latest.title": "Latest",
    "section.latest.title.accent": "additions",
    "section.types.title": "Three ways to",
    "section.types.title.accent": "level up",
    "type.book.t": "PDF Books",
    "type.book.d": "Curated study materials from top publishers and educators.",
    "type.exam.t": "Mock Exams",
    "type.exam.d": "Real exam papers with detailed answer keys and explanations.",
    "type.quiz.t": "AI Quizzes",
    "type.quiz.d": "Interactive timed quizzes that adapt to your learning level.",
    "feat.quality.t": "Verified Quality",
    "feat.quality.d": "Every resource is reviewed by our expert team.",
    "feat.educators.t": "Top Educators",
    "feat.educators.d": "Learn from the best teachers around the world.",
    "feat.pi.t": "Pi Network Ready",
    "feat.pi.d": "Pay with USD, local currency or Pi cryptocurrency.",
    "cta.kicker": "Limited time",
    "cta.title": "Ready to",
    "cta.title.accent": "level up?",
    "cta.subtitle": "Join thousands of learners and educators building the future of education.",
    "cta.start": "Get started free",
    "cta.browse": "Browse catalog",

    "products.title": "Browse resources",
    "products.subtitle": "Discover {count}+ books, exams and quizzes.",
    "products.search": "Search resources...",
    "products.filter.subject": "Subject",
    "products.filter.country": "Country",
    "products.filter.allSubjects": "All subjects",
    "products.filter.allCountries": "All countries",
    "products.sort.popular": "Most popular",
    "products.sort.rating": "Top rated",
    "products.sort.priceAsc": "Price: Low to High",
    "products.sort.priceDesc": "Price: High to Low",
    "products.empty": "No resources found.",
    "products.reset": "Reset filters",

    "card.free": "Free",
    "card.by": "by",

    "admin.title": "Admin Panel",
    "admin.subtitle": "Add new books, lessons and exams to the platform.",
    "admin.add": "Add new product",
    "admin.list": "Current products",
    "admin.form.titleField": "Title",
    "admin.form.description": "Description",
    "admin.form.type": "Type",
    "admin.form.subject": "Subject",
    "admin.form.country": "Country",
    "admin.form.stage": "Stage",
    "admin.form.price": "Price (USD)",
    "admin.form.author": "Author",
    "admin.form.image": "Image URL (optional)",
    "admin.form.submit": "Add product",
    "admin.form.cancel": "Cancel",
    "admin.success": "Product added successfully",
    "admin.delete": "Delete",
    "admin.confirm": "Are you sure?",
    "admin.denied": "Access denied. Admins only.",
    "admin.signinAsAdmin": "Sign in as admin",
    "admin.type.book": "PDF Book",
    "admin.type.exam": "Exam",
    "admin.type.quiz": "Quiz",

    "common.loading": "Loading...",
    "common.required": "Required",
    "common.signinRequired": "Sign in required",
    "common.goSignin": "Go to sign in",
  },

  fr: {
    "nav.home": "Accueil",
    "nav.browse": "Explorer",
    "nav.dashboard": "Tableau de bord",
    "nav.admin": "Admin",
    "nav.signin": "Connexion",
    "nav.signout": "Déconnexion",
    "nav.cart": "Panier",
    "nav.language": "Langue",
    "nav.theme": "Thème",

    "hero.badge": "Propulsé par l'IA · Compatible Pi Network",
    "hero.title.1": "Apprenez mieux",
    "hero.title.2": "avec du",
    "hero.title.3": "contenu néon",
    "hero.title.4": "boosté par l'IA.",
    "hero.subtitle":
      "Découvrez des milliers de PDF, examens blancs et quiz interactifs créés par les meilleurs éducateurs — dans une seule plateforme cinématographique.",
    "hero.cta.start": "Commencer",
    "hero.cta.teacher": "Devenir enseignant",
    "hero.stat.resources": "Ressources",
    "hero.stat.educators": "Éducateurs",
    "hero.stat.loved": "Adoré",
    "hero.trusted": "Approuvé dans plus de 60 pays",

    "section.trending.kicker": "Tendance",
    "section.trending.title": "Les plus populaires",
    "section.trending.title.accent": "cette semaine",
    "section.viewAll": "Tout voir",
    "section.categories.kicker": "Catégories",
    "section.categories.title": "Parcourir par",
    "section.categories.title.accent": "matière",
    "section.categories.subtitle": "Trouvez du contenu adapté à votre domaine.",
    "section.latest.kicker": "Nouveautés",
    "section.latest.title": "Derniers",
    "section.latest.title.accent": "ajouts",
    "section.types.title": "Trois façons de",
    "section.types.title.accent": "progresser",
    "type.book.t": "Livres PDF",
    "type.book.d": "Matériel pédagogique sélectionné par les meilleurs.",
    "type.exam.t": "Examens blancs",
    "type.exam.d": "Vrais sujets d'examen avec corrigés détaillés.",
    "type.quiz.t": "Quiz IA",
    "type.quiz.d": "Quiz interactifs adaptés à votre niveau.",
    "feat.quality.t": "Qualité vérifiée",
    "feat.quality.d": "Chaque ressource est validée par notre équipe.",
    "feat.educators.t": "Meilleurs éducateurs",
    "feat.educators.d": "Apprenez auprès des meilleurs enseignants au monde.",
    "feat.pi.t": "Compatible Pi Network",
    "feat.pi.d": "Payez en USD, monnaie locale ou cryptomonnaie Pi.",
    "cta.kicker": "Durée limitée",
    "cta.title": "Prêt à",
    "cta.title.accent": "progresser ?",
    "cta.subtitle": "Rejoignez des milliers d'apprenants et d'éducateurs.",
    "cta.start": "Commencer gratuitement",
    "cta.browse": "Parcourir",

    "products.title": "Parcourir les ressources",
    "products.subtitle": "Découvrez plus de {count} livres, examens et quiz.",
    "products.search": "Rechercher...",
    "products.filter.subject": "Matière",
    "products.filter.country": "Pays",
    "products.filter.allSubjects": "Toutes matières",
    "products.filter.allCountries": "Tous pays",
    "products.sort.popular": "Plus populaire",
    "products.sort.rating": "Mieux notés",
    "products.sort.priceAsc": "Prix : croissant",
    "products.sort.priceDesc": "Prix : décroissant",
    "products.empty": "Aucune ressource trouvée.",
    "products.reset": "Réinitialiser",

    "card.free": "Gratuit",
    "card.by": "par",

    "admin.title": "Panneau Admin",
    "admin.subtitle": "Ajouter de nouveaux livres, cours et examens.",
    "admin.add": "Ajouter un produit",
    "admin.list": "Produits actuels",
    "admin.form.titleField": "Titre",
    "admin.form.description": "Description",
    "admin.form.type": "Type",
    "admin.form.subject": "Matière",
    "admin.form.country": "Pays",
    "admin.form.stage": "Niveau",
    "admin.form.price": "Prix (USD)",
    "admin.form.author": "Auteur",
    "admin.form.image": "URL de l'image (optionnel)",
    "admin.form.submit": "Ajouter",
    "admin.form.cancel": "Annuler",
    "admin.success": "Produit ajouté avec succès",
    "admin.delete": "Supprimer",
    "admin.confirm": "Êtes-vous sûr ?",
    "admin.denied": "Accès refusé. Admins uniquement.",
    "admin.signinAsAdmin": "Se connecter en tant qu'admin",
    "admin.type.book": "Livre PDF",
    "admin.type.exam": "Examen",
    "admin.type.quiz": "Quiz",

    "common.loading": "Chargement...",
    "common.required": "Requis",
    "common.signinRequired": "Connexion requise",
    "common.goSignin": "Se connecter",
  },
};

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
  init: () => void;
}

export const useI18n = create<I18nState>((set) => ({
  lang: "ar",
  setLang: (l) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
      localStorage.setItem("lang", l);
    }
    set({ lang: l });
  },
  init: () => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("lang") as Lang | null) ?? "ar";
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    set({ lang: saved });
  },
}));

export function useT() {
  const lang = useI18n((s) => s.lang);
  return (key: string, vars?: Record<string, string | number>) => {
    let val = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        val = val.replace(`{${k}}`, String(v));
      }
    }
    return val;
  };
}

/** Hook to call once at app root to hydrate language + dir from localStorage. */
export function useI18nInit() {
  const init = useI18n((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
}

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];
