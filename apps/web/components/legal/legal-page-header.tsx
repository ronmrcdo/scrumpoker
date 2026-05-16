import {
  Badge,
  Calendar,
  ChevronRight,
  Clock,
  Home,
  type LucideIcon,
} from "@repo/ui";
import Link from "next/link";

interface LegalPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  documentType: string;
  effectiveDate: string;
  version?: string;
  readingTimeMinutes?: number;
}

export function LegalPageHeader({
  icon: Icon,
  title,
  description,
  documentType,
  effectiveDate,
  version,
  readingTimeMinutes,
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

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-bone-2 p-4 shadow-soft-sm">
            <Icon aria-hidden="true" className="size-8 text-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{documentType}</Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar aria-hidden="true" className="size-3" />
          Effective: {effectiveDate}
        </Badge>
        {version && <Badge variant="outline">Version {version}</Badge>}
        {readingTimeMinutes && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3" />~{readingTimeMinutes}{" "}
            min read
          </Badge>
        )}
      </div>
    </div>
  );
}
