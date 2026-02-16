import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto max-w-3xl space-y-8 px-4">
          {children}
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
