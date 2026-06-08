import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Script from "next/script";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const outfit = localFont({
  src: "../public/Outfit-Variable.ttf",
  display: "swap",
  variable: "--font-outfit",
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kavinorganics.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kavin Organics — Home Garden Store",
    template: "%s | Kavin Organics",
  },
  description:
    "Quality seeds, fertilizers, pots, grow bags and gardening essentials delivered to your door across Tamil Nadu. Free delivery above ₹999.",
  keywords: [
    "organic seeds", "home garden", "grow bags", "vermicompost", "cocopeat",
    "terracotta pots", "balcony garden", "kitchen garden", "Tamil Nadu",
    "Namakkal", "Thiruchengode", "organic gardening",
  ],
  authors: [{ name: "Kavin Organics", url: BASE_URL }],
  creator: "Kavin Organics",
  publisher: "Kavin Organics",
  formatDetection: { email: false, address: false, telephone: false },

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Kavin Organics",
    title: "Kavin Organics — Home Garden Store",
    description:
      "Quality seeds, fertilizers, pots, grow bags and gardening essentials delivered across Tamil Nadu. Free delivery above ₹999.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,   // Place a 1200×630 image in /public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Kavin Organics — Home Garden Store",
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Kavin Organics — Home Garden Store",
    description:
      "Quality seeds, fertilizers, pots and grow bags delivered across Tamil Nadu.",
    images: [`${BASE_URL}/og-image.jpg`],
  },

  // ── Robots ───────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  // ── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon:    [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple:   [{ url: "/apple-touch-icon.png" }],
  },

  // ── Verification (add when you set up Google Search Console) ─────────────
  // verification: { google: "YOUR_GOOGLE_VERIFICATION_CODE" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        figtree.variable,
        outfit.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        {/* LocalBusiness structured data — helps Google local search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Kavin Organics",
              description:
                "Home garden store selling organic seeds, fertilizers, pots, grow bags and gardening essentials in Tamil Nadu.",
              url: BASE_URL,
              telephone: "+91-98765-43210",
              email: "hello@kavinorganics.in",
              address: {
                "@type": "PostalAddress",
                streetAddress: "No. 45, Market Road",
                addressLocality: "Thiruchengode",
                addressRegion: "Tamil Nadu",
                postalCode: "637211",
                addressCountry: "IN",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "09:00",
                  closes: "16:00",
                },
              ],
              priceRange: "₹",
              servesCuisine: null,
              image: `${BASE_URL}/og-image.jpg`,
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}