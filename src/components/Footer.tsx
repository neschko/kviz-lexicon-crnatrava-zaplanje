import { BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Footer() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-bold text-foreground">Црнотравски речник</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Радосав Стојановић · Српски дијалектолошки зборник LVII · САНУ, 2010
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Дигитална верзија за очување и промоцију црнотравског говора
        </p>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Укључи дневни режим" : "Укључи ноћни режим"}
            aria-pressed={isDark}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDark ? "Дан" : "Ноћ"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
