import { BookOpen } from "lucide-react";

export function Footer() {
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
      </div>
    </footer>
  );
}
