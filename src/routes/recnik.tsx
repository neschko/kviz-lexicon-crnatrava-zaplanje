import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordCard } from "@/components/WordCard";
import dictionaryData from "@/data/dictionary.json";
import { CATEGORY_LABELS, type DictionaryEntry } from "@/data/types";

export const Route = createFileRoute("/recnik")({
  head: () => ({
    meta: [
      { title: "Речник — Црнотравски речник" },
      { name: "description", content: "Претражујте и прегледајте све речи Црнотравског речника са дефиницијама и примерима." },
      { property: "og:title", content: "Речник — Црнотравски речник" },
      { property: "og:description", content: "Претражујте и прегледајте све речи Црнотравског речника." },
    ],
  }),
  component: RecnikPage,
});

const entries = dictionaryData as DictionaryEntry[];
const letters = [...new Set(entries.map((e) => e.letter))].sort();
const PAGE_SIZE = 50;

// Compute available categories with counts
const categoryCounts = entries.reduce<Record<string, number>>((acc, e) => {
  for (const c of e.categories ?? []) {
    acc[c] = (acc[c] ?? 0) + 1;
  }
  return acc;
}, {});
const availableCategories = Object.entries(categoryCounts)
  .filter(([c]) => CATEGORY_LABELS[c])
  .sort((a, b) => b[1] - a[1])
  .map(([c]) => c);

function RecnikPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryMatchAll, setCategoryMatchAll] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = entries;
    if (activeLetter) {
      result = result.filter((e) => e.letter === activeLetter);
    }
    if (activeCategories.length > 0) {
      result = result.filter((e) => {
        const cats = e.categories ?? [];
        return categoryMatchAll
          ? activeCategories.every((c) => cats.includes(c))
          : activeCategories.some((c) => cats.includes(c));
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.word.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeLetter, activeCategories, categoryMatchAll]);

  // Reset visible count when filters change
  useMemo(() => setVisible(PAGE_SIZE), [search, activeLetter, activeCategories, categoryMatchAll]);

  const shown = filtered.slice(0, visible);
  const hasFilters = activeLetter || activeCategories.length > 0 || search;

  const visibleCategories = useMemo(() => {
    const q = categoryQuery.toLowerCase().trim();
    if (!q) return availableCategories;
    return availableCategories.filter(
      (c) =>
        c.toLowerCase().includes(q) ||
        CATEGORY_LABELS[c]?.toLowerCase().includes(q)
    );
  }, [categoryQuery]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Речник</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Претражи речи или дефиниције..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-base h-11"
        />
      </div>

      {/* Alphabet nav */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Слово</p>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveLetter(null)}
            className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${
              !activeLetter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Све
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(letter === activeLetter ? null : letter)}
              className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${
                activeLetter === letter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Категорије {activeCategories.length > 0 && `(${activeCategories.length})`}
          </p>
          <div className="flex items-center gap-2">
            {activeCategories.length >= 2 && (
              <button
                onClick={() => setCategoryMatchAll((v) => !v)}
                className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                title="Промени логику комбиновања"
              >
                {categoryMatchAll ? "све изабране" : "било која"}
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder="Тражи категорију..."
                className="h-7 pl-6 text-xs w-44"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategories([])}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategories.length === 0
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Све
          </button>
          {visibleCategories.map((cat) => {
            const active = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                title={CATEGORY_LABELS[cat]}
              >
                {CATEGORY_LABELS[cat]} ({categoryCounts[cat]})
              </button>
            );
          })}
          {visibleCategories.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Нема категорија за „{categoryQuery}"</p>
          )}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length.toLocaleString("sr")} {filtered.length === 1 ? "реч" : "речи"}
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setActiveLetter(null);
              setActiveCategories([]);
              setCategoryQuery("");
            }}
            className="gap-1 h-8"
          >
            <X className="h-3.5 w-3.5" />
            Поништи филтере
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {shown.map((entry) => (
          <WordCard key={entry.id} entry={entry} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Нема резултата</p>
            <p className="text-sm mt-1">Покушајте са другим термином</p>
          </div>
        )}
      </div>

      {visible < filtered.length && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Учитај још ({filtered.length - visible})
          </Button>
        </div>
      )}
    </div>
  );
}
