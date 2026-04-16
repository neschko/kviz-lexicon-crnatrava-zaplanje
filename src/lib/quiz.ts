import dictionaryData from "@/data/dictionary.json";
import { CATEGORY_LABELS, type DictionaryEntry } from "@/data/types";

export type QuizMode = "definition" | "word" | "example";

export const ALL_ENTRIES = (dictionaryData as DictionaryEntry[]).filter(
  (e) => e.definition.length > 10 && e.word.length >= 3 && e.word.length <= 18
);

// Entries usable for the "fill the example" mode: must have at least one
// example sentence that actually contains the target word.
export const EXAMPLE_ENTRIES = ALL_ENTRIES.filter((e) =>
  e.examples.some((ex) => maskWord(ex, e.word) !== null)
);

// Categories present in the filtered pool, with counts
export const QUIZ_CATEGORIES = (() => {
  const counts: Record<string, number> = {};
  for (const e of ALL_ENTRIES) {
    for (const c of e.categories ?? []) {
      if (CATEGORY_LABELS[c]) counts[c] = (counts[c] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= 4) // need at least 4 for a question
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => ({ key: c, label: CATEGORY_LABELS[c], count: n }));
})();

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Replace the first occurrence of `word` inside `sentence` with a blank.
 * Matching is case-insensitive and tolerant to common Serbian inflectional
 * suffixes (we match the stem). Returns null if no match found.
 */
export function maskWord(sentence: string, word: string): string | null {
  if (!sentence || !word) return null;
  const stem = word.length > 4 ? word.slice(0, Math.max(3, word.length - 2)) : word;
  const re = new RegExp(`\\b${escapeRegex(stem)}\\p{L}{0,4}\\b`, "iu");
  if (!re.test(sentence)) return null;
  return sentence.replace(re, "_____");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$1");
}

export interface QuizQuestion {
  correct: DictionaryEntry;
  options: DictionaryEntry[];
  maskedExample?: string;
}

export function generateQuestion(
  mode: QuizMode,
  categoryFilter: string | null
): QuizQuestion | null {
  let pool = mode === "example" ? EXAMPLE_ENTRIES : ALL_ENTRIES;
  if (categoryFilter) {
    pool = pool.filter((e) => e.categories?.includes(categoryFilter));
  }
  if (pool.length < 4) return null;

  const shuffled = shuffleArray(pool);
  const correct = shuffled[0];
  // distractors: prefer same-pool, otherwise fall back to all entries
  const distractorPool = shuffled.slice(1);
  const wrong = distractorPool.slice(0, 3);
  const options = shuffleArray([correct, ...wrong]);

  if (mode === "example") {
    const validExamples = correct.examples
      .map((ex) => maskWord(ex, correct.word))
      .filter((x): x is string => x !== null);
    return {
      correct,
      options,
      maskedExample: validExamples[0],
    };
  }
  return { correct, options };
}
