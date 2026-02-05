"use client";

import { Geist } from "next/font/google";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa] dark:bg-[#171717]">
          <div className="w-full max-w-md text-center">
            {/* Card container with inline styles for reliability */}
            <div
              className="rounded-lg border p-8 sm:p-10 bg-white dark:bg-[#262626] border-[#e5e5e5] dark:border-[#404040]"
              style={{
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Icon container */}
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 bg-[#f5f5f5] dark:bg-[#404040]">
                {/* Inline SVG for ServerCrash icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-labelledby="server-crash-icon-title"
                >
                  <title id="server-crash-icon-title">Server error icon</title>
                  <path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
                  <path d="M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
                  <path d="M6 6h.01" />
                  <path d="M6 18h.01" />
                  <path d="m13 6-4 6h6l-4 6" />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-semibold mb-3 text-[#404040] dark:text-[#f5f5f5]">
                Oops! Something broke
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base mb-2 text-[#737373] dark:text-[#a3a3a3]">
                We encountered a critical error while loading the application.
              </p>

              {/* Suggestion */}
              <p className="text-xs sm:text-sm mb-6 text-[#737373]/80 dark:text-[#a3a3a3]/80">
                Please try refreshing the page. If the problem persists, try
                clearing your browser cache.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 text-white transition-colors bg-[#6b7de6] hover:bg-[#5561d3]"
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 border-2 transition-colors border-[#e5e5e5] dark:border-[#404040] bg-white dark:bg-[#262626] text-[#404040] dark:text-[#f5f5f5] hover:bg-[#f5f5f5] dark:hover:bg-[#404040]"
                >
                  Go to Lobby
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
