import { Suspense } from "react";

import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { KickedAlert } from "@/components/poker/kicked-alert";

export default function LandingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <KickedAlert />
      </Suspense>
      <LandingHeader />
      <main id="top">
        <HeroSection />
        <FeaturesSection />
      </main>
      <LandingFooter />
    </>
  );
}
