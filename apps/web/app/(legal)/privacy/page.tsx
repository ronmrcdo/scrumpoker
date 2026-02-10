import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Scrum Poker Game",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground">
        This page is under construction. Our privacy policy will be available
        here soon.
      </p>
    </div>
  );
}
