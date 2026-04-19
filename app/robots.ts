// app/robots.ts

import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kavinorganics.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout",
          "/order-confirmation",
          "/track-order",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}