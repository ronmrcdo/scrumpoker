import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Use - Scrum Poker Game",
};

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        Terms &amp; Use
      </h1>
      <p className="text-muted-foreground">
        This page is under construction. Our terms of use will be available here
        soon.
      </p>
    </div>
  );
}
