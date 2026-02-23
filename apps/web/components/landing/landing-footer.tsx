import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 pb-safe">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left: Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/scrum-poker.png"
                alt=""
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span className="text-sm font-bold tracking-tight text-foreground">
                Scrum<span className="text-primary"> Poker</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &copy; {currentYear} Scrum Poker Game.
              <br />
              Real-time planning poker for agile teams.
            </p>
          </div>

          {/* Right: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
