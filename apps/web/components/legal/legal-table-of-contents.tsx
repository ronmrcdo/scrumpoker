import type { LucideIcon } from "@repo/ui";

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
    <div className="border-l-2 border-primary/20 py-2 pl-4">
      <h2
        id="toc-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Table of Contents
      </h2>
      <nav aria-labelledby="toc-heading">
        <ol className="space-y-1 text-sm sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-1 sm:space-y-0">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group flex items-center gap-2 py-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="w-5 font-mono text-xs text-muted-foreground/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
