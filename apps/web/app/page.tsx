import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { Suspense } from "react";

import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { KickedAlert } from "@/components/poker/kicked-alert";
import {
  getFaqJsonLd,
  getHowToJsonLd,
  getOrganizationJsonLd,
  getWebApplicationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/structured-data";

const FeaturesSection = dynamic(() =>
  import("@/components/landing/features-section").then(
    (m) => m.FeaturesSection,
  ),
);
const DeckSection = dynamic(() =>
  import("@/components/landing/deck-section").then((m) => m.DeckSection),
);
const CtaSection = dynamic(() =>
  import("@/components/landing/cta-section").then((m) => m.CtaSection),
);

export default async function LandingPage() {
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") ?? undefined;
  return (
    <>
      {/* Browsers strip the CSP nonce from the live DOM after parsing, so
          React's hydration check sees a mismatch on every nonce'd inline
          script. These are server-rendered static JSON-LD payloads with no
          client-side behavior, so suppressing the warning here is safe. */}
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebApplicationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebSiteJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHowToJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
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
        <DeckSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
