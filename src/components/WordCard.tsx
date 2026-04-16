import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DictionaryEntry } from "@/data/types";

interface WordCardProps {
  entry: DictionaryEntry;
  compact?: boolean;
}

export function WordCard({ entry, compact = false }: WordCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-border/60 bg-card">
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading text-xl font-bold text-foreground">{entry.word}</h3>
          {entry.typeFull && (
            <Badge variant="secondary" className="text-xs shrink-0 font-normal">
              {entry.typeFull}
            </Badge>
          )}
        </div>
        <p className="text-foreground/80 leading-relaxed">{entry.definition}</p>
        {entry.examples.length > 0 && !compact && (
          <div className="mt-3 space-y-1">
            {entry.examples.map((ex, i) => (
              <p key={i} className="text-sm text-muted-foreground italic pl-3 border-l-2 border-primary/20">
                „{ex}"
              </p>
            ))}
          </div>
        )}
        {entry.examples.length > 0 && compact && (
          <p className="text-sm text-muted-foreground italic mt-2 pl-3 border-l-2 border-primary/20 line-clamp-1">
            „{entry.examples[0]}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
