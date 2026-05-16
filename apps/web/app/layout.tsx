import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { CookieConsent } from "@/components/cookie-consent";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SITE_URL } from "@/lib/config";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Scrum Poker Game - Real-Time Agile Estimation",
    template: "%s | Scrum Poker Game",
  },
  description:
    "Free real-time planning poker for agile teams. Estimate stories together — no sign-up required. Create a room and start planning instantly.",
  keywords: [
    "scrum poker",
    "planning poker",
    "agile estimation",
    "story points",
    "sprint planning",
    "real-time voting",
    "agile tools",
    "scrum tools",
    "team estimation",
    "fibonacci estimation",
  ],
  authors: [{ name: "Scrum Poker Game" }],
  creator: "Scrum Poker Game",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Scrum Poker Game",
    title: "Scrum Poker Game - Real-Time Agile Estimation",
    description:
      "Free real-time planning poker for agile teams. Estimate stories together — no sign-up required.",
    images: [
      {
        url: "/scrum-poker.png",
        width: 512,
        height: 512,
        alt: "Scrum Poker Game logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Scrum Poker Game - Real-Time Agile Estimation",
    description:
      "Free real-time planning poker for agile teams. Estimate stories together — no sign-up required.",
    images: ["/scrum-poker.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `
(function() {
  try {
    // Migrate old theme key to new key (one-time, skip if already done)
    var newKey = 'scrumpoker-theme';
    var migKey = 'scrumpoker-migrated';
    if (!localStorage.getItem(migKey)) {
      var oldKeys = ['myscrum-theme', 'anteup-theme'];
      for (var i = 0; i < oldKeys.length; i++) {
        if (localStorage.getItem(oldKeys[i]) && !localStorage.getItem(newKey)) {
          localStorage.setItem(newKey, localStorage.getItem(oldKeys[i]));
        }
        localStorage.removeItem(oldKeys[i]);
      }
      localStorage.setItem(migKey, '1');
    }
    var stored = JSON.parse(localStorage.getItem(newKey) || '{}');
    var mode = stored.state && stored.state.mode;
    if (mode === 'system' || !mode) {
      document.documentElement.removeAttribute('data-theme');
    } else if (mode === 'light' || mode === 'dark') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  } catch(e) {
    // Fail silently and let CSS prefers-color-scheme handle it
    document.documentElement.removeAttribute('data-theme');
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to content
        </a>
        <Providers>
          <ThemeProvider>
            {children}
            <CookieConsent />
          </ThemeProvider>
        </Providers>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL && (
          <>
            <Script
              async
              defer
              nonce={nonce}
              data-domain={new URL(SITE_URL).hostname}
              src={process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL}
              strategy="afterInteractive"
            />
            <Script
              id="plausible-init"
              nonce={nonce}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
