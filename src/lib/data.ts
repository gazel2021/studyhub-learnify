import type { Product } from "./store";
import math from "@/assets/course-math.jpg";
import physics from "@/assets/course-physics.jpg";
import chemistry from "@/assets/course-chemistry.jpg";
import english from "@/assets/course-english.jpg";
import biology from "@/assets/course-biology.jpg";
import history from "@/assets/course-history.jpg";

export const SUBJECTS = [
  { name: "Mathematics", image: math, color: "from-blue-500 to-cyan-500" },
  { name: "Physics", image: physics, color: "from-purple-500 to-pink-500" },
  { name: "Chemistry", image: chemistry, color: "from-cyan-500 to-teal-500" },
  { name: "English", image: english, color: "from-amber-500 to-orange-500" },
  { name: "Biology", image: biology, color: "from-green-500 to-emerald-500" },
  { name: "History", image: history, color: "from-orange-500 to-red-500" },
];

export const COUNTRIES = ["Egypt", "Saudi Arabia", "UAE", "Jordan", "Morocco", "Global"];
export const STAGES = ["Primary", "Middle", "High School", "University"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Advanced Calculus Master Guide",
    description: "Comprehensive PDF covering limits, derivatives, integrals with 200+ solved problems and step-by-step explanations from top university lecturers.",
    type: "book",
    subject: "Mathematics",
    country: "Egypt",
    stage: "High School",
    price: 19.99,
    rating: 4.9,
    badge: "Hot",
    image: math,
    author: "Dr. Ahmed Hassan",
  },
  {
    id: "p2",
    title: "Quantum Physics Essentials",
    description: "Modern physics simplified — quantum mechanics, relativity, and particle physics with interactive examples.",
    type: "book",
    subject: "Physics",
    country: "Global",
    stage: "University",
    price: 24.99,
    rating: 4.8,
    badge: "Best",
    image: physics,
    author: "Prof. Sarah Lee",
  },
  {
    id: "p3",
    title: "Organic Chemistry Workbook",
    description: "Master organic reactions and mechanisms with this comprehensive workbook including practice tests.",
    type: "exam",
    subject: "Chemistry",
    country: "UAE",
    stage: "High School",
    price: 0,
    rating: 4.7,
    badge: "New",
    image: chemistry,
    author: "Dr. Omar Khalil",
  },
  {
    id: "p4",
    title: "IELTS Preparation Bundle",
    description: "Complete IELTS prep with mock tests, vocabulary builder, and writing samples to score 7+ band.",
    type: "quiz",
    subject: "English",
    country: "Global",
    stage: "University",
    price: 29.99,
    rating: 5.0,
    badge: "Hot",
    image: english,
    author: "Emma Watson",
  },
  {
    id: "p5",
    title: "Cell Biology Interactive Quiz",
    description: "Test your knowledge with 100+ MCQ questions on cellular structure, mitosis, and genetics.",
    type: "quiz",
    subject: "Biology",
    country: "Saudi Arabia",
    stage: "High School",
    price: 9.99,
    rating: 4.6,
    image: biology,
    author: "Dr. Layla Mansour",
  },
  {
    id: "p6",
    title: "World History Through Ages",
    description: "Explore civilizations from ancient times to the modern era with maps, timelines, and analysis.",
    type: "book",
    subject: "History",
    country: "Jordan",
    stage: "Middle",
    price: 14.99,
    rating: 4.5,
    badge: "New",
    image: history,
    author: "Prof. Karim Said",
  },
  {
    id: "p7",
    title: "Algebra Foundations",
    description: "Build strong algebra fundamentals — equations, inequalities, functions and graphs.",
    type: "book",
    subject: "Mathematics",
    country: "Morocco",
    stage: "Middle",
    price: 0,
    rating: 4.4,
    image: math,
    author: "Mr. Youssef",
  },
  {
    id: "p8",
    title: "Chemistry Final Mock Exam",
    description: "Full mock exam simulating the national finals with detailed answer key.",
    type: "exam",
    subject: "Chemistry",
    country: "Egypt",
    stage: "High School",
    price: 7.99,
    rating: 4.8,
    badge: "Hot",
    image: chemistry,
    author: "Dr. Mona Adel",
  },
];

export const QUIZ_QUESTIONS = [
  {
    q: "What is the derivative of sin(x)?",
    options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"],
    correct: 0,
  },
  {
    q: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correct: 2,
  },
  {
    q: "Solve: 2x + 5 = 15",
    options: ["x = 5", "x = 10", "x = 7.5", "x = 3"],
    correct: 0,
  },
  {
    q: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correct: 1,
  },
  {
    q: "What is H2O?",
    options: ["Salt", "Sugar", "Water", "Oxygen"],
    correct: 2,
  },
];
