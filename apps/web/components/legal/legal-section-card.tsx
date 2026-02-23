import { Card, CardContent, CardHeader, type LucideIcon } from "@repo/ui";

interface LegalSectionCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export function LegalSectionCard({
  id,
  icon: Icon,
  title,
  children,
}: LegalSectionCardProps) {
  return (
    <Card
      id={id}
      className="scroll-mt-24 overflow-hidden border-l-2 border-l-primary/30 dark:border-l-primary/20"
    >
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="shrink-0 rounded-lg bg-primary/[0.08] p-2">
          <Icon aria-hidden="true" className="size-4 text-primary/70" />
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
