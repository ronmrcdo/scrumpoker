import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrumpokergame.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/poker/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
