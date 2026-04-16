import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, BookOpen, Gamepad2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordCard } from "@/components/WordCard";
import dictionaryData from "@/data/dictionary.json";
import type { DictionaryEntry } from "@/data/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function getWordOfTheDay(): DictionaryEntry {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % dictionaryData.length;
  return dictionaryData[dayIndex] as DictionaryEntry;
}

function Index() {
  const wordOfDay = getWordOfTheDay();
  const [randomEntries, setRandomEntries] = useState<DictionaryEntry[]>(() => {
    // Use deterministic initial selection for SSR
    return (dictionaryData as DictionaryEntry[]).slice(0, 4);
  });

  useEffect(() => {
    // Randomize on client only to avoid hydration mismatch
    const shuffled = [...dictionaryData].sort(() => Math.random() - 0.5).slice(0, 4) as DictionaryEntry[];
    setRandomEntries(shuffled);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Дигитално издање · САНУ 2010
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
            Црнотравски речник
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Радосав Стојановић · Српски дијалектолошки зборник LVII
          </p>
          <p className="text-base text-foreground/70 max-w-xl mx-auto mb-10">
            Откријте богатство црнотравског говора — преко 4.000 речи са дефиницијама, примерима употребе и граматичким ознакама.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link to="/recnik"><Search className="h-5 w-5" />Претражи речник</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 text-base">
              <Link to="/kviz"><Gamepad2 className="h-5 w-5" />Играј квиз</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Word of the Day */}
      <section className="py-12 bg-card/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Реч дана</h2>
          </div>
          <WordCard entry={wordOfDay} />
        </div>
      </section>

      {/* Random entries */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Истражите речи</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {randomEntries.map((entry) => (
              <WordCard key={entry.id} entry={entry} compact />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/recnik">Погледај све речи →</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
