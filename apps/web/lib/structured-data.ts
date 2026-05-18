import { SITE_URL as siteUrl } from "@/lib/config";

const SITE_NAME = "Scrum Poker Game";
const SITE_DESCRIPTION =
  "Free real-time planning poker for agile teams. Estimate stories together — no sign-up required. Create a room and share the link to start estimating in seconds.";

export function getWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}#webapp`,
    name: SITE_NAME,
    alternateName: ["Planning Poker", "Scrum Poker", "Agile Estimation Tool"],
    url: siteUrl,
    description: SITE_DESCRIPTION,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ProjectManagementApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time voting",
      "Anonymous estimation",
      "Instant analytics",
      "No sign-up required",
      "Fibonacci estimation scales",
      "Live chat for team discussion",
      "Vote masking until reveal",
      "Consensus and distribution metrics",
    ],
    image: `${siteUrl}/scrum-poker.png`,
    screenshot: `${siteUrl}/scrum-poker.png`,
    softwareVersion: "1.0",
    publisher: {
      "@id": `${siteUrl}#org`,
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#org`,
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/scrum-poker.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@scrumpokergame.com",
      contactType: "customer support",
    },
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@id": `${siteUrl}#org`,
    },
  };
}

export function getHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to run a planning poker session with Scrum Poker Game",
    description:
      "Step-by-step instructions for facilitating a real-time planning poker estimation session with your agile team in under a minute — no sign-up required.",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    tool: [
      { "@type": "HowToTool", name: "Web browser" },
      { "@type": "HowToTool", name: "Internet connection" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Create a room",
        text: "Open scrumpokergame.com, enter your display name and a room name, then click Create Room. A private room is created instantly with a unique shareable link.",
        url: `${siteUrl}#create`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Invite your team",
        text: "Copy the room URL and share it with up to 24 teammates. They can join immediately with just a display name — no account, email, or password needed.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Vote on a story",
        text: "Each participant selects a card representing their estimate (typically Fibonacci values: 1, 2, 3, 5, 8, 13, 21). All votes stay hidden until reveal to prevent anchoring.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Reveal and discuss",
        text: "The facilitator clicks Reveal to flip all cards at once. View instant consensus, distribution, and suggested estimate. Discuss outliers and re-vote if needed.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Move to the next story",
        text: "Click Reset to clear votes and start estimating the next story. Rooms stay active for 24 hours so your team can keep going as long as you need.",
      },
    ],
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
          text: "Scrum Poker Game is a free, real-time planning poker tool for agile teams. It lets team members collaboratively estimate story points during sprint planning sessions using a shared room URL — no account required.",
        },
      },
      {
        "@type": "Question",
        name: "What is planning poker?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Planning poker is a consensus-based estimation technique used by agile teams to size user stories. Each participant privately selects a card representing their effort estimate, then all cards are revealed simultaneously to prevent anchoring bias and encourage discussion.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Scrum Poker Game requires no sign-up or account creation. Create a room, share the link, and start estimating immediately. Authentication is anonymous and session-based.",
        },
      },
      {
        "@type": "Question",
        name: "Is Scrum Poker Game free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Scrum Poker Game is completely free to use with no paid tiers, no ads, and no usage limits beyond fair-use rate limiting (5 room creations per minute per IP).",
        },
      },
      {
        "@type": "Question",
        name: "How long do poker rooms last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rooms expire automatically 24 hours after creation. All associated data — including player display names and votes — is permanently deleted when the room expires.",
        },
      },
      {
        "@type": "Question",
        name: "How many people can join a planning poker room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each room supports up to 24 participants simultaneously, which covers most agile team sizes including combined squads or scaled estimation sessions.",
        },
      },
      {
        "@type": "Question",
        name: "What estimation scale does Scrum Poker Game use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The default deck uses the modified Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) along with a 'need more info' card. This is the most common scale for story point estimation in Scrum and other agile frameworks.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Scrum Poker Game collects no personal information — no email, no name verification, no tracking cookies. Analytics use Plausible, a cookie-free privacy-focused service. Vote data is masked from other players until reveal and is deleted within 24 hours.",
        },
      },
    ],
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
