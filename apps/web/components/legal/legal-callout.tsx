import { cn, type LucideIcon } from "@repo/ui";

const variantStyles: Record<string, string> = {
  info: "border-l-foreground/40 bg-bone-2 text-foreground",
  success: "border-l-success bg-success/10 text-success",
  warning: "border-l-destructive bg-destructive/10 text-destructive",
};

interface LegalCalloutProps {
  variant: "info" | "success" | "warning";
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
}

export function LegalCallout({
  variant,
  icon: Icon,
  title,
  children,
}: LegalCalloutProps) {
  return (
    <aside
      className={cn(
        "rounded-lg border-l-2 p-4 text-sm leading-relaxed",
        variantStyles[variant],
      )}
    >
      {(title || Icon) && (
        <div className="mb-2 flex items-center gap-2">
          {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
          {title && <strong>{title}</strong>}
        </div>
      )}
      <div>{children}</div>
    </aside>
  );
}
