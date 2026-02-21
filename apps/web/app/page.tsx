import { Suspense } from "react";

import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { KickedAlert } from "@/components/poker/kicked-alert";
import {
  getFaqJsonLd,
  getOrganizationJsonLd,
  getWebApplicationJsonLd,
} from "@/lib/structured-data";

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebApplicationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd()),
        }}
      />
      <Suspense fallback={null}>
        <KickedAlert />
      </Suspense>
      <LandingHeader />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
      </main>
      <LandingFooter />
    </>
  );
}
