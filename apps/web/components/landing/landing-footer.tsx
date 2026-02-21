import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 pb-safe">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left: Branding */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Image
                src="/scrum-poker.png"
                alt="Scrum Poker Game"
                width={24}
                height={24}
                className="rounded-sm"
              />
              <span className="text-sm font-semibold text-primary">Scrum</span>
              <span className="text-sm font-light text-muted-foreground">
                Poker Game
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} Scrum Poker Game. Real-time planning poker
              for agile teams.
            </p>
          </div>

          {/* Right: Legal */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms &amp; Use
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
