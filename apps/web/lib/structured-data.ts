const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrumpokergame.com";

export function getWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scrum Poker Game",
    url: siteUrl,
    description:
      "Free real-time planning poker for agile teams. Estimate stories together — no sign-up required. Create a room and start planning instantly.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time voting",
      "Anonymous estimation",
      "Team chat",
      "Instant analytics",
      "No sign-up required",
      "Fibonacci estimation scales",
    ],
    image: `${siteUrl}/scrum-poker.png`,
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scrum Poker Game",
    url: siteUrl,
    logo: `${siteUrl}/scrum-poker.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@scrumpokergame.com",
      contactType: "customer support",
    },
  };
}

export function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Scrum Poker Game?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scrum Poker Game is a free, real-time planning poker tool for agile teams. It allows team members to collaboratively estimate story points during sprint planning sessions.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Scrum Poker Game requires no sign-up or account creation. Simply create a room and share the link with your team to start estimating.",
        },
      },
      {
        "@type": "Question",
        name: "Is Scrum Poker Game free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Scrum Poker Game is completely free to use with no paid tiers, no ads, and no usage limits beyond fair-use rate limiting.",
        },
      },
      {
        "@type": "Question",
        name: "How long do poker rooms last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Poker rooms expire automatically 24 hours after creation. All associated data, including player information and votes, is deleted when the room expires.",
        },
      },
    ],
  };
}
