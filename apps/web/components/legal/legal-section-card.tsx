import { Card, CardContent, CardHeader, cn, type LucideIcon } from "@repo/ui";

const borderColorMap: Record<string, string> = {
  primary: "border-l-primary-300 dark:border-l-primary-500/60",
  accent: "border-l-accent-300 dark:border-l-accent-500/60",
  warm: "border-l-warm-300 dark:border-l-warm-500/60",
};

interface LegalSectionCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  accentColor?: "primary" | "accent" | "warm";
  children: React.ReactNode;
}

export function LegalSectionCard({
  id,
  icon: Icon,
  title,
  accentColor = "primary",
  children,
}: LegalSectionCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        "scroll-mt-24 overflow-hidden border-l-4",
        borderColorMap[accentColor] ?? borderColorMap.primary,
      )}
    >
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="shrink-0 rounded-lg bg-muted p-2">
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        </div>
        <h2 className="text-base font-semibold leading-none tracking-tight sm:text-lg">
          {title}
        </h2>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}
