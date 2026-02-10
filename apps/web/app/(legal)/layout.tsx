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
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">{children}</div>
      </main>
      <LandingFooter />
    </>
  );
}
