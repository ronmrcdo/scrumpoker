import { Badge, Calendar, ChevronRight, Home, type LucideIcon } from "@repo/ui";
import Link from "next/link";

interface LegalPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  documentType: string;
  effectiveDate: string;
  version?: string;
}

export function LegalPageHeader({
  icon: Icon,
  title,
  description,
  documentType,
  effectiveDate,
  version,
}: LegalPageHeaderProps) {
  return (
    <div className="space-y-4">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <Home aria-hidden="true" className="size-3.5" />
          Home
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <span className="font-medium text-foreground">{title}</span>
      </nav>

      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl bg-primary-50 p-3 shadow-soft-sm dark:bg-primary-500/10">
          <Icon className="size-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-base text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{documentType}</Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="size-3" />
          Effective: {effectiveDate}
        </Badge>
        {version && <Badge variant="outline">Version {version}</Badge>}
      </div>
    </div>
  );
}
