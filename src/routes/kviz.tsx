import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy, BookOpen, HelpCircle } from "lucide-react";
import dictionaryData from "@/data/dictionary.json";
import type { DictionaryEntry } from "@/data/types";

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

// Filter to entries with reasonable definitions and short, distinctive words for the "guess word" mode
const entries = (dictionaryData as DictionaryEntry[]).filter(
  (e) => e.definition.length > 10 && e.word.length >= 3 && e.word.length <= 18
);

type Mode = "definition" | "word";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion() {
  const shuffled = shuffleArray(entries);
  const correct = shuffled[0];
  const wrongOptions = shuffled.slice(1, 4);
  const options = shuffleArray([correct, ...wrongOptions]);
  return { correct, options };
}

function KvizPage() {
  const [mode, setMode] = useState<Mode>("definition");
  const [question, setQuestion] = useState<{ correct: DictionaryEntry; options: DictionaryEntry[] } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // Generate first question on client only to avoid SSR hydration mismatch
  useEffect(() => {
    setQuestion(generateQuestion());
  }, []);

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
    setQuestion(generateQuestion());
    setSelected(null);
  }, []);

  const resetQuiz = useCallback(() => {
    setScore(0);
    setTotal(0);
    setQuestion(generateQuestion());
    setSelected(null);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setScore(0);
    setTotal(0);
    setQuestion(generateQuestion());
    setSelected(null);
  }, []);

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Квиз</h1>
        <div className="h-64 animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

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

      {/* Mode switcher */}
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-lg">
        <button
          onClick={() => switchMode("definition")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === "definition"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Погоди значење
        </button>
        <button
          onClick={() => switchMode("word")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
            mode === "word"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Погоди реч
        </button>
      </div>

      {/* Question card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {mode === "definition" ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">Шта значи реч:</p>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                {question.correct.word}
              </h2>
              {question.correct.typeFull && (
                <Badge variant="outline" className="mt-2">{question.correct.typeFull}</Badge>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">Која реч одговара овом значењу:</p>
              <p className="font-heading text-xl text-foreground leading-snug">
                „{question.correct.definition}"
              </p>
              {question.correct.typeFull && (
                <Badge variant="outline" className="mt-3">{question.correct.typeFull}</Badge>
              )}
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
            <button key={opt.id} className={className} onClick={() => handleSelect(opt.id)}>
              <div className="flex items-start justify-between gap-3">
                {mode === "definition" ? (
                  <p className="text-foreground">{opt.definition}</p>
                ) : (
                  <p className="font-heading text-lg font-semibold text-foreground">{opt.word}</p>
                )}
                {selected !== null && isCorrect && <CheckCircle className="h-5 w-5 text-accent shrink-0" />}
                {selected !== null && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive shrink-0" />}
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
                <>✗ Нетачно. Тачан одговор: <span className="text-foreground">{question.correct.definition}</span></>
              ) : (
                <>✗ Нетачно. Тачна реч: <span className="text-foreground font-heading">{question.correct.word}</span></>
              )}
            </p>
          )}
          {question.correct.examples.length > 0 && (
            <p className="text-sm text-muted-foreground italic mb-4">
              „{question.correct.examples[0]}"
            </p>
          )}
          <Button onClick={nextQuestion} className="gap-2">
            Следеће питање →
          </Button>
        </div>
      )}
    </div>
  );
}
