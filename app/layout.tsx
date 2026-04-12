import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = localFont({
  src: "../public/Outfit-Variable.ttf",
  display: "swap",
  variable: "--font-outfit",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kavin Organics — Home Garden Store",
  description: "Quality seeds, fertilizers, pots, grow bags and gardening essentials delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className="font-sans antialiased">
        {/* LanguageProvider at root so every page (shop, admin, etc.) shares the same locale */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}