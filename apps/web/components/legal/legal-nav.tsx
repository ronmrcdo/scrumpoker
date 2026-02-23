import { AlertTriangle, cn, FileText, Shield } from "@repo/ui";
import Link from "next/link";

const legalPages = [
  { path: "/privacy", label: "Privacy Policy", icon: Shield },
  { path: "/terms", label: "Terms of Service", icon: FileText },
  { path: "/disclaimer", label: "Disclaimer", icon: AlertTriangle },
] as const;

interface LegalNavProps {
  currentPath: "/privacy" | "/terms" | "/disclaimer";
}

export function LegalNav({ currentPath }: LegalNavProps) {
  return (
    <nav
      aria-label="Legal documents"
      className="flex items-center gap-1 border-b border-border/50 pb-1"
    >
      {legalPages.map(({ path, label, icon: Icon }) => {
        const isActive = path === currentPath;
        return (
          <Link
            key={path}
            href={path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon aria-hidden="true" className="hidden size-3.5 sm:inline" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
