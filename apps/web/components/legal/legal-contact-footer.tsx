import { Card, CardContent, Mail } from "@repo/ui";

interface LegalContactFooterProps {
  subject?: string;
}

export function LegalContactFooter({
  subject = "questions or concerns",
}: LegalContactFooterProps) {
  return (
    <Card className="border-border/50 bg-muted/30">
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center text-sm text-muted-foreground">
        <Mail aria-hidden="true" className="size-5 text-primary" />
        <p>
          For {subject}, please contact us at{" "}
          <a
            href="mailto:info@scrumpokergame.com"
            className="font-semibold text-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            info@scrumpokergame.com
          </a>
        </p>
        <p className="text-xs text-muted-foreground/70">
          We will make reasonable efforts to respond in a timely manner.
        </p>
      </CardContent>
    </Card>
  );
}
