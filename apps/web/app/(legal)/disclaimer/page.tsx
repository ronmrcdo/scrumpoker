import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Scrum Poker Game",
};

export default function DisclaimerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        Disclaimer
      </h1>
      <p className="text-muted-foreground">
        This page is under construction. Our disclaimer will be available here
        soon.
      </p>
    </div>
  );
}
