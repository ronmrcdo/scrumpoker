import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ante Up - Real-Time Scrum Poker & Agile Estimation",
  description: "Real-Time Scrum Poker & Agile Estimation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const themeScript = `
(function() {
  try {
    // Migrate old theme key to new key (one-time)
    var oldKey = 'myscrum-theme';
    var newKey = 'anteup-theme';
    if (localStorage.getItem(oldKey) && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, localStorage.getItem(oldKey));
      localStorage.removeItem(oldKey);
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to content
        </a>
        <PostHogProvider>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
          </Providers>
        </PostHogProvider>
      </body>
    </html>
  );
}
