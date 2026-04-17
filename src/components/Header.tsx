import { Link } from "@tanstack/react-router";
import { BookOpen, Search, Gamepad2, Info } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/60 bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Црнотравски речник
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/recnik"
            activeProps={{ className: "bg-primary/15 text-primary" }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground/90 hover:text-foreground hover:bg-primary/10 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Речник</span>
          </Link>
          <Link
            to="/kviz"
            activeProps={{ className: "bg-primary/15 text-primary" }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground/90 hover:text-foreground hover:bg-primary/10 transition-colors"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Квиз</span>
          </Link>
          <Link
            to="/o-recniku"
            activeProps={{ className: "bg-primary/15 text-primary" }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground/90 hover:text-foreground hover:bg-primary/10 transition-colors"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">О речнику</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
