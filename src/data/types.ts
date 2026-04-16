export interface DictionaryEntry {
  id: number;
  word: string;
  type: string;
  typeFull: string;
  definition: string;
  examples: string[];
  letter: string;
  categories?: string[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  бот: "ботаника",
  зоол: "зоологија",
  агр: "агрономија",
  анат: "анатомија",
  мед: "медицина",
  геогр: "географија",
  етн: "етнологија",
  пеј: "пејоратив",
  фиг: "фигуративно",
  ирон: "иронично",
  хип: "хипокористик",
  дем: "деминутив",
  ауг: "аугментатив",
  аут: "аугментатив",
  кул: "кулинарство",
  муз: "музика",
  мит: "митологија",
  деч: "дечје",
  шаљ: "шаљиво",
  заст: "застарело",
};
