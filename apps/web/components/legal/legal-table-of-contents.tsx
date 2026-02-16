import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type LucideIcon,
} from "@repo/ui";

interface TocItem {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface LegalTableOfContentsProps {
  items: TocItem[];
}

export function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  return (
    <Card className="border-border/50 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav aria-label="Table of contents">
          <ol className="space-y-1.5 text-sm">
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group flex items-center gap-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="w-5 font-mono text-xs text-muted-foreground/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="size-3.5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                  <span>{item.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </CardContent>
    </Card>
  );
}
