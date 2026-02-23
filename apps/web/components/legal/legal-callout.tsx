import { cn, type LucideIcon } from "@repo/ui";

const variantStyles: Record<string, string> = {
  info: "border-l-primary/40 bg-primary-50 text-primary-700 dark:border-l-primary/30 dark:bg-primary-500/10 dark:text-primary-400",
  success:
    "border-l-accent/40 bg-accent-50 text-accent-700 dark:border-l-accent/30 dark:bg-accent-500/10 dark:text-accent-400",
  warning:
    "border-l-warm/40 bg-warm-50 text-warm-700 dark:border-l-warm/30 dark:bg-warm-500/10 dark:text-warm-400",
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
