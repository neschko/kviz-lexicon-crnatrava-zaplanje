import { BookOpen, HelpCircle, FileText } from "lucide-react";
import type { QuizMode } from "@/lib/quiz";

interface Props {
  mode: QuizMode;
  onChange: (m: QuizMode) => void;
}

const MODES: { key: QuizMode; label: string; icon: typeof BookOpen }[] = [
  { key: "definition", label: "Погоди значење", icon: BookOpen },
  { key: "word", label: "Погоди реч", icon: HelpCircle },
  { key: "example", label: "Допуни реченицу", icon: FileText },
];

export function QuizModeSelector({ mode, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4 p-1 bg-muted rounded-lg">
      {MODES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            mode === key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}
