import type { Product } from "./store";
import math from "@/assets/course-math.jpg";
import physics from "@/assets/course-physics.jpg";
import chemistry from "@/assets/course-chemistry.jpg";
import english from "@/assets/course-english.jpg";
import biology from "@/assets/course-biology.jpg";
import history from "@/assets/course-history.jpg";

/** Subject keys are stable; labels are translated via i18n (subject.<key>) */
export const SUBJECTS = [
  { key: "math", image: math, color: "from-blue-500 to-cyan-500" },
  { key: "physics", image: physics, color: "from-purple-500 to-pink-500" },
  { key: "chemistry", image: chemistry, color: "from-cyan-500 to-teal-500" },
  { key: "english", image: english, color: "from-amber-500 to-orange-500" },
  { key: "biology", image: biology, color: "from-green-500 to-emerald-500" },
  { key: "history", image: history, color: "from-orange-500 to-red-500" },
  { key: "arabic", image: english, color: "from-rose-500 to-pink-500" },
  { key: "islamic", image: history, color: "from-emerald-500 to-teal-500" },
];

export const SUBJECT_IMAGES: Record<string, string> = Object.fromEntries(
  SUBJECTS.map((s) => [s.key, s.image]),
);

/** Country codes — labels via i18n (country.<code>) */
export const COUNTRIES = [
  "EG", "SA", "AE", "JO", "MA", "DZ", "TN", "QA", "KW", "OM", "BH", "IQ", "YE", "LB", "SY", "PS", "LY", "SD", "GLOBAL",
];

/** Stage keys — labels via i18n (stage.<key>) */
export const STAGES = ["primary", "middle", "high", "university"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "دليل التفاضل والتكامل المتقدم",
    description:
      "كتاب PDF شامل يغطي النهايات والمشتقات والتكاملات مع أكثر من 200 مسألة محلولة وشروحات تفصيلية من نخبة أساتذة الجامعات.",
    type: "book",
    subject: "math",
    country: "EG",
    stage: "high",
    price: 19.99,
    rating: 4.9,
    badge: "Hot",
    image: math,
    author: "د. أحمد حسن",
    status: "approved",
    ownerId: "seed",
    ownerRole: "admin",
    pages: 240,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "p2",
    title: "أساسيات الفيزياء الكمية",
    description:
      "الفيزياء الحديثة مبسّطة — ميكانيكا الكم والنسبية وفيزياء الجسيمات مع أمثلة تفاعلية.",
    type: "book",
    subject: "physics",
    country: "GLOBAL",
    stage: "university",
    price: 24.99,
    rating: 4.8,
    badge: "Best",
    image: physics,
    author: "أ.د. سارة لي",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 320,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "p3",
    title: "كتاب الكيمياء العضوية التطبيقي",
    description:
      "إتقان التفاعلات والآليات في الكيمياء العضوية مع تدريبات شاملة ونماذج اختبارات.",
    type: "exam",
    subject: "chemistry",
    country: "AE",
    stage: "high",
    price: 0,
    rating: 4.7,
    badge: "New",
    image: chemistry,
    author: "د. عمر خليل",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 80,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "p4",
    title: "حزمة تحضير IELTS الكاملة",
    description:
      "تحضير شامل لاختبار IELTS مع امتحانات تجريبية ومفردات وعينات كتابة لتحقيق درجة 7+.",
    type: "quiz",
    subject: "english",
    country: "GLOBAL",
    stage: "university",
    price: 29.99,
    rating: 5.0,
    badge: "Hot",
    image: english,
    author: "إيما واطسون",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 150,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "p5",
    title: "اختبار تفاعلي في علم الأحياء الخلوي",
    description:
      "اختبر معرفتك مع أكثر من 100 سؤال اختيار من متعدد حول البنية الخلوية والانقسام والوراثة.",
    type: "quiz",
    subject: "biology",
    country: "SA",
    stage: "high",
    price: 9.99,
    rating: 4.6,
    image: biology,
    author: "د. ليلى منصور",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 60,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "p6",
    title: "تاريخ العالم عبر العصور",
    description:
      "استكشف الحضارات من العصور القديمة إلى الحديثة مع خرائط وخطوط زمنية وتحليلات.",
    type: "book",
    subject: "history",
    country: "JO",
    stage: "middle",
    price: 14.99,
    rating: 4.5,
    badge: "New",
    image: history,
    author: "أ.د. كريم سعيد",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 180,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "p7",
    title: "أساسيات الجبر",
    description: "بناء أساس قوي في الجبر — المعادلات والمتباينات والدوال والرسوم.",
    type: "book",
    subject: "math",
    country: "MA",
    stage: "middle",
    price: 0,
    rating: 4.4,
    image: math,
    author: "أ. يوسف",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 120,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "p8",
    title: "الامتحان النهائي التجريبي للكيمياء",
    description: "امتحان تجريبي كامل يحاكي الامتحانات الوطنية مع نموذج إجابة مفصّل.",
    type: "exam",
    subject: "chemistry",
    country: "EG",
    stage: "high",
    price: 7.99,
    rating: 4.8,
    badge: "Hot",
    image: chemistry,
    author: "د. منى عادل",
    status: "approved",
    ownerId: "seed",
    ownerRole: "teacher",
    pages: 40,
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const QUIZ_QUESTIONS = [
  { q: "ما هي مشتقة sin(x)؟", options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], correct: 0 },
  { q: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟", options: ["الأكسجين", "ثاني أكسيد الكربون", "النيتروجين", "الهيدروجين"], correct: 2 },
  { q: "حل المعادلة: 2س + 5 = 15", options: ["س = 5", "س = 10", "س = 7.5", "س = 3"], correct: 0 },
  { q: "من كتب مسرحية 'هاملت'؟", options: ["تشارلز ديكنز", "وليم شكسبير", "مارك توين", "جين أوستن"], correct: 1 },
  { q: "ما هو H2O؟", options: ["ملح", "سكر", "ماء", "أكسجين"], correct: 2 },
];

/**
 * Sample readable content for each product (used when the book has no uploaded body).
 * Free portion (~20%) is always visible; the rest is locked behind purchase.
 */
export const SAMPLE_PARAGRAPHS = [
  "يهدف هذا المحتوى إلى تقديم شرح مبسّط وشامل للمفاهيم الأساسية مع أمثلة عملية وتمارين متدرّجة في الصعوبة.",
  "تم إعداد المادة من قبل نخبة من المعلمين المتخصصين بناءً على المناهج الدراسية المعتمدة في عدد من الدول العربية.",
  "كل فصل يبدأ بمقدمة تربط الموضوع بالواقع، ثم يعرض النظرية مدعومة بالرسوم التوضيحية، وينتهي بأسئلة مراجعة وإجاباتها.",
  "التركيز على بناء الفهم العميق بدلاً من الحفظ، مع أمثلة من الحياة اليومية.",
  "في نهاية كل وحدة ستجد اختباراً قصيراً لقياس مدى استيعابك ومراجعة النقاط الأساسية.",
  "تمت مراجعة المحتوى من قبل خبراء متخصصين لضمان الدقة العلمية والملاءمة العمرية.",
  "يمكنك العودة إلى أي فصل في أي وقت ومتابعة من حيث توقفت بفضل نظام تتبّع التقدم.",
  "نوصي بحل التمارين فور الانتهاء من كل قسم لترسيخ المعلومات بشكل أفضل.",
  "المحتوى متاح بجودة عالية وقابل للتحميل والقراءة دون اتصال بالإنترنت بعد الشراء.",
  "نتمنى لك رحلة تعليمية ممتعة ومثمرة مع StudyHub.",
];
