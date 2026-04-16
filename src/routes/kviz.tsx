import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { QuizModeSelector } from "@/components/QuizModeSelector";
import {
  generateQuestion,
  QUIZ_CATEGORIES,
  type QuizMode,
  type QuizQuestion,
} from "@/lib/quiz";

export const Route = createFileRoute("/kviz")({
  head: () => ({
    meta: [
      { title: "Квиз — Црнотравски речник" },
      { name: "description", content: "Тестирајте своје знање црнотравског дијалекта кроз забаван квиз." },
      { property: "og:title", content: "Квиз — Црнотравски речник" },
      { property: "og:description", content: "Тестирајте своје знање црнотравског дијалекта." },
    ],
  }),
  component: KvizPage,
});

function KvizPage() {
  const [mode, setMode] = useState<QuizMode>("definition");
  const [category, setCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // Generate first question on client only to avoid SSR hydration mismatch
  useEffect(() => {
    setQuestion(generateQuestion(mode, category));
  }, [mode, category]);

  const handleSelect = useCallback(
    (id: number) => {
      if (selected !== null || !question) return;
      setSelected(id);
      setTotal((t) => t + 1);
      if (id === question.correct.id) {
        setScore((s) => s + 1);
      }
    },
    [selected, question]
  );

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(mode, category));
    setSelected(null);
  }, [mode, category]);

  const resetQuiz = useCallback(() => {
    setScore(0);
    setTotal(0);
    setQuestion(generateQuestion(mode, category));
    setSelected(null);
  }, [mode, category]);

  const switchMode = useCallback((m: QuizMode) => {
    setMode(m);
    setScore(0);
    setTotal(0);
    setSelected(null);
  }, []);

  const switchCategory = useCallback((c: string | null) => {
    setCategory(c);
    setScore(0);
    setTotal(0);
    setSelected(null);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">Квиз</h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-base px-3 py-1">
            <Trophy className="h-4 w-4 mr-1" />
            {score}/{total}
          </Badge>
          <Button variant="ghost" size="icon" onClick={resetQuiz} title="Почни испочетка">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <QuizModeSelector mode={mode} onChange={switchMode} />

      {/* Category filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Категорија
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => switchCategory(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              category === null
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Све
          </button>
          {QUIZ_CATEGORIES.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => switchCategory(key === category ? null : key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                category === key
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {!question ? (
        <div className="h-64 animate-pulse bg-muted rounded-lg" />
      ) : (
        <QuizBody
          question={question}
          mode={mode}
          selected={selected}
          onSelect={handleSelect}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
}

interface QuizBodyProps {
  question: QuizQuestion;
  mode: QuizMode;
  selected: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
}

function QuizBody({ question, mode, selected, onSelect, onNext }: QuizBodyProps) {
  return (
    <>
      {/* Question card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {mode === "definition" && (
            <>
              <p className="text-sm text-muted-foreground mb-2">Шта значи реч:</p>
              <h2 className="font-heading text-3xl font-bold text-foreground">{question.correct.word}</h2>
              {question.correct.typeFull && (
                <Badge variant="outline" className="mt-2">
                  {question.correct.typeFull}
                </Badge>
              )}
            </>
          )}
          {mode === "word" && (
            <>
              <p className="text-sm text-muted-foreground mb-2">Која реч одговара овом значењу:</p>
              <p className="font-heading text-xl text-foreground leading-snug">
                „{question.correct.definition}"
              </p>
              {question.correct.typeFull && (
                <Badge variant="outline" className="mt-3">
                  {question.correct.typeFull}
                </Badge>
              )}
            </>
          )}
          {mode === "example" && (
            <>
              <p className="text-sm text-muted-foreground mb-2">Која реч недостаје у реченици:</p>
              <p className="font-heading text-lg text-foreground leading-snug italic">
                „{question.maskedExample}"
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Значење: <span className="text-foreground">{question.correct.definition}</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt) => {
          const isCorrect = opt.id === question.correct.id;
          const isSelected = selected === opt.id;
          let className = "w-full text-left p-4 rounded-lg border-2 transition-all ";

          if (selected === null) {
            className += "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
          } else if (isCorrect) {
            className += "border-accent bg-accent/10";
          } else if (isSelected && !isCorrect) {
            className += "border-destructive bg-destructive/10";
          } else {
            className += "border-border opacity-50";
          }

          return (
            <button key={opt.id} className={className} onClick={() => onSelect(opt.id)}>
              <div className="flex items-start justify-between gap-3">
                {mode === "definition" ? (
                  <p className="text-foreground">{opt.definition}</p>
                ) : (
                  <p className="font-heading text-lg font-semibold text-foreground">{opt.word}</p>
                )}
                {selected !== null && isCorrect && <CheckCircle className="h-5 w-5 text-accent shrink-0" />}
                {selected !== null && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="text-center">
          {selected === question.correct.id ? (
            <p className="text-accent font-semibold mb-3">✓ Тачно! Браво!</p>
          ) : (
            <p className="text-destructive font-semibold mb-3">
              {mode === "definition" ? (
                <>
                  ✗ Нетачно. Тачан одговор:{" "}
                  <span className="text-foreground">{question.correct.definition}</span>
                </>
              ) : (
                <>
                  ✗ Нетачно. Тачна реч:{" "}
                  <span className="text-foreground font-heading">{question.correct.word}</span>
                </>
              )}
            </p>
          )}
          {mode !== "example" && question.correct.examples.length > 0 && (
            <p className="text-sm text-muted-foreground italic mb-4">
              „{question.correct.examples[0]}"
            </p>
          )}
          <Button onClick={onNext} className="gap-2">
            Следеће питање →
          </Button>
        </div>
      )}
    </>
  );
}
