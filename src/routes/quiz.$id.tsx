import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trophy, ArrowRight, Check, X } from "lucide-react";
import { QUIZ_QUESTIONS, PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/quiz/$id")({
  component: QuizPage,
});

function QuizPage() {
  const { id } = Route.useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [time, setTime] = useState(60);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (time === 0 && !done) setDone(true);
  }, [time, done]);

  const q = QUIZ_QUESTIONS[current];
  const score = answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  };

  if (done) {
    const finalScore = answers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length;
    const pct = Math.round((finalScore / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto h-24 w-24 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow">
          <Trophy className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold mt-6">Quiz complete!</h1>
        <p className="text-muted-foreground mt-2">Here's how you did</p>
        <div className="glass rounded-3xl p-8 mt-8">
          <div className="text-6xl font-extrabold text-gradient-brand">{pct}%</div>
          <div className="text-muted-foreground mt-2">{finalScore} of {QUIZ_QUESTIONS.length} correct</div>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <Link to="/dashboard"><Button variant="outline" className="h-12 px-6 rounded-xl">Dashboard</Button></Link>
          <Link to="/products"><Button className="h-12 px-6 rounded-xl bg-gradient-brand text-white">More quizzes</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">{product?.title ?? "Quiz"}</p>
          <h1 className="text-2xl font-bold">Question {current + 1} of {QUIZ_QUESTIONS.length}</h1>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl glass font-semibold ${time < 10 ? "text-destructive" : ""}`}>
          <Clock className="h-4 w-4" /> {time}s
        </div>
      </div>

      <Progress value={((current) / QUIZ_QUESTIONS.length) * 100} className="h-2 mb-8" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-3xl p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6">{q.q}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-smooth flex items-center gap-3 ${
                  selected === i ? "border-primary bg-primary/5 shadow-elegant" : "border-border hover:border-primary/40"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-semibold text-sm ${selected === i ? "bg-gradient-brand text-white" : "bg-muted"}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
          <Button onClick={handleNext} disabled={selected === null} className="w-full mt-6 h-12 rounded-xl bg-gradient-brand text-white shadow-elegant disabled:opacity-50">
            {current + 1 === QUIZ_QUESTIONS.length ? "Finish" : "Next question"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
