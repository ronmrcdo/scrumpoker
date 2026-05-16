import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background pb-safe">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-end">
          <div className="sm:col-span-9 space-y-2">
            <div className="text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
              Scrum Poker
            </div>
            <p className="text-base sm:text-lg text-muted-foreground">
              A planning instrument for agile teams.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with{" "}
              <span role="img" aria-label="love">
                ❤
              </span>{" "}
              by{" "}
              <a
                href="https://ronmrcdo.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                ronmrcdo.dev
              </a>
            </p>
          </div>
          <div className="sm:col-span-3 space-y-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Link
              href="/privacy"
              className="block hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="block hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/disclaimer"
              className="block hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
